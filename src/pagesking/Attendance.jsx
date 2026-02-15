import React, { useEffect, useState } from 'react';
import api from '../api/client';

const DEFAULT_BRANCHES = ['Computer Engineering', 'Engineering', 'MBA', 'Pharmacy'];

function Attendance() {
  const [branch, setBranch] = useState('Computer Engineering');
  const [branches, setBranches] = useState(DEFAULT_BRANCHES);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await api.get('/attendance-branches');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBranches(res.data);
          setBranch((currentBranch) => (res.data.includes(currentBranch) ? currentBranch : res.data[0]));
        }
      } catch {
        alert('Unable to load branches.');
      }
    }

    loadBranches();
  }, []);

  useEffect(() => {
    if (!branch) return;

    async function loadStudents() {
      setLoading(true);
      try {
        const res = await api.get('/getStudents', { params: { branch } });
        const list = Array.isArray(res.data) ? res.data : [];
        setStudents(list.slice(0, 10));
      } catch {
        alert('Unable to fetch students.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [branch]);

  async function updateStatus(id, status) {
    const previousStudents = students;
    const updatedStudents = students.map((s) => (s._id === id ? { ...s, todayStatus: status } : s));
    setStudents(updatedStudents);

    try {
      await api.post('/markAttendance', {
        studentId: id,
        status,
      });
    } catch {
      setStudents(previousStudents);
      alert('Failed to update attendance.');
    }
  }

  function present(id) {
    updateStatus(id, 'P');
  }

  function absent(id) {
    updateStatus(id, 'A');
  }

  async function save() {
    const presentList = students
      .filter((s) => s.todayStatus === 'P')
      .map((s) => `${s.rollNo} - ${s.name}`);
    const presentCount = presentList.length;
    const absentCount = students.filter((s) => s.todayStatus === 'A').length;

    setSaving(true);
    try {
      await api.post('/submit-final', {
        branch,
        presentList,
        presentCount,
      });
      alert(`Saved Successfully!\nBranch: ${branch}\nPresent: ${presentCount}\nAbsent: ${absentCount}`);
    } catch {
      alert('Attendance save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="attendance-container" style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
      <style>{`
        .attendance-container { padding: 20px; text-align: center; font-family: sans-serif; }
        h1 { color: #333; }
        select { padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc; }
        table { width: 80%; margin: 20px auto; border-collapse: collapse; background-color: lightyellow; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        th { background-color: #007bff; color: white; padding: 10px; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .btn { padding: 5px 10px; margin: 0 5px; border: none; color: white; cursor: pointer; border-radius: 3px; }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-p { background-color: green; }
        .btn-a { background-color: red; }
        .btn-save { padding: 10px 20px; background-color: darkblue; font-size: 16px; margin-top: 20px; color: white; border: none; cursor: pointer; border-radius: 5px; }
      `}</style>
      <h1>Attendance (Beginner)</h1>

      <select value={branch} onChange={(e) => setBranch(e.target.value)}>
        {branches.map((branchName) => (
          <option key={branchName} value={branchName}>
            {branchName}
          </option>
        ))}
      </select>
      <br />
      <br />

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan="3">No students found</td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.todayStatus || 'Pending'}</td>
                <td>
                  <button className="btn btn-p" onClick={() => present(s._id)} disabled={saving}>
                    P
                  </button>
                  <button className="btn btn-a" onClick={() => absent(s._id)} disabled={saving}>
                    A
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <br />
      <button className="btn btn-save" onClick={save} disabled={saving || loading || students.length === 0}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

export default Attendance;
