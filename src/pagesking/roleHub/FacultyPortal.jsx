import React, { useEffect, useState } from 'react';
import api from '../../api/client';

function FacultyPortal({ setPage }) {
  const facultyName = typeof window !== 'undefined' ? localStorage.getItem('demoUserName') || 'Faculty' : 'Faculty';

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  const [attendanceRows, setAttendanceRows] = useState([
    { id: 1, course: 'SE-A', present: 54, total: 60 },
    { id: 2, course: 'SE-B', present: 49, total: 60 },
    { id: 3, course: 'TE-AI', present: 43, total: 52 },
  ]);

  const [assignments, setAssignments] = useState([]);
  const [circulars, setCirculars] = useState([]);

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentBatch, setAssignmentBatch] = useState('');
  const [assignmentDue, setAssignmentDue] = useState('');
  const [circularTitle, setCircularTitle] = useState('');
  const [circularAudience, setCircularAudience] = useState('');

  let totalPresent = 0;
  let totalStudents = 0;
  attendanceRows.forEach((row) => {
    totalPresent += row.present;
    totalStudents += row.total;
  });
  const attendancePercent = totalStudents === 0 ? 0 : Math.round((totalPresent / totalStudents) * 100);

  let totalPending = 0;
  assignments.forEach((row) => {
    const submittedCount = Number(row.submitted || 0);
    const totalCount = Number(row.total || 0);
    totalPending += totalCount - submittedCount;
  });

  async function loadAssignments() {
    try {
      const res = await api.get('/faculty/assignments');
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert('Unable to load assignments');
    }
  }

  async function loadCirculars() {
    try {
      const res = await api.get('/faculty/circulars');
      setCirculars(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert('Unable to load circulars');
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssignments();
      loadCirculars();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  function addPresent(id) {
    const updated = attendanceRows.map((row) => {
      if (row.id !== id) return row;
      let next = row.present + 1;
      if (next > row.total) next = row.total;
      return { ...row, present: next };
    });
    setAttendanceRows(updated);
  }

  function removePresent(id) {
    const updated = attendanceRows.map((row) => {
      if (row.id !== id) return row;
      let next = row.present - 1;
      if (next < 0) next = 0;
      return { ...row, present: next };
    });
    setAttendanceRows(updated);
  }

  async function createAssignment(e) {
    e.preventDefault();
    if (!assignmentTitle.trim() || !assignmentBatch.trim() || !assignmentDue) {
      alert('Please fill assignment details');
      return;
    }

    try {
      const res = await api.post('/faculty/assignments', {
        title: assignmentTitle.trim(),
        batch: assignmentBatch.trim(),
        due: assignmentDue,
        submitted: 0,
        total: 60,
      });

      if (res.data?.assignment) {
        setAssignments((prev) => [res.data.assignment, ...prev]);
      } else {
        await loadAssignments();
      }

      setAssignmentTitle('');
      setAssignmentBatch('');
      setAssignmentDue('');
      alert('Assignment created');
    } catch {
      alert('Failed to create assignment');
    }
  }

  async function createCircular(e) {
    e.preventDefault();
    if (!circularTitle.trim() || !circularAudience.trim()) {
      alert('Please fill circular details');
      return;
    }

    try {
      const res = await api.post('/faculty/circulars', {
        title: circularTitle.trim(),
        audience: circularAudience.trim(),
        status: 'Published',
      });

      if (res.data?.circular) {
        setCirculars((prev) => [res.data.circular, ...prev]);
      } else {
        await loadCirculars();
      }

      setCircularTitle('');
      setCircularAudience('');
      alert('Circular published');
    } catch {
      alert('Failed to publish circular');
    }
  }

  const pageStyle = { backgroundColor: 'transparent', minHeight: '100vh', padding: 20, fontFamily: 'Arial, sans-serif' };
  const cardStyle = { background: '#fff', border: '1px solid #d9e4f5', borderRadius: 8, padding: 12, marginBottom: 12 };
  const inputStyle = { width: '100%', padding: 8, marginBottom: 8 };
  const btnStyle = { padding: '8px 12px', backgroundColor: '#2b67c9', color: '#fff', border: 'none', cursor: 'pointer' };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginTop: 0 }}>Faculty Dashboard</h2>
      <p>Welcome, {facultyName}</p>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Quick Links</h3>
        <button type="button" style={{ ...btnStyle, marginRight: 8 }} onClick={() => setPage('Attendance')}>
          Attendance
        </button>
        <button type="button" style={{ ...btnStyle, marginRight: 8 }} onClick={() => setPage('Assignment')}>
          Assignment
        </button>
        <button type="button" style={btnStyle} onClick={() => setPage('Circular')}>
          Circular
        </button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Attendance</h3>
        <p>
          Overall: {attendancePercent}% ({totalPresent}/{totalStudents})
        </p>
        {attendanceRows.map((row) => (
          <div key={row.id} style={{ border: '1px solid #d9e4f5', padding: 8, borderRadius: 6, marginBottom: 8 }}>
            <b>{row.course}</b>
            <p style={{ margin: '6px 0' }}>
              {row.present}/{row.total}
            </p>
            <button type="button" style={{ ...btnStyle, marginRight: 8 }} onClick={() => addPresent(row.id)}>
              + Present
            </button>
            <button type="button" style={btnStyle} onClick={() => removePresent(row.id)}>
              - Present
            </button>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Assignments</h3>
        <p>Pending Submissions: {totalPending}</p>
        <button type="button" style={{ ...btnStyle, marginBottom: 8 }} onClick={loadAssignments}>
          Refresh Assignments
        </button>
        <form onSubmit={createAssignment}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Assignment title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Batch"
            value={assignmentBatch}
            onChange={(e) => setAssignmentBatch(e.target.value)}
          />
          <input style={inputStyle} type="date" value={assignmentDue} onChange={(e) => setAssignmentDue(e.target.value)} />
          <button type="submit" style={btnStyle}>
            Create Assignment
          </button>
        </form>

        <div style={{ marginTop: 10 }}>
          {assignments.map((a) => (
            <div key={a._id || a.id} style={{ border: '1px solid #d9e4f5', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <b>{a.title}</b> ({a.batch})
              <p style={{ margin: '6px 0' }}>
                Due: {a.due} | Submitted: {a.submitted}/{a.total}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Circular</h3>
        <button type="button" style={{ ...btnStyle, marginBottom: 8 }} onClick={loadCirculars}>
          Refresh Circulars
        </button>
        <form onSubmit={createCircular}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Circular title"
            value={circularTitle}
            onChange={(e) => setCircularTitle(e.target.value)}
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Audience"
            value={circularAudience}
            onChange={(e) => setCircularAudience(e.target.value)}
          />
          <button type="submit" style={btnStyle}>
            Publish Circular
          </button>
        </form>

        <div style={{ marginTop: 10 }}>
          {circulars.map((c) => (
            <div key={c._id || c.id} style={{ border: '1px solid #d9e4f5', padding: 8, borderRadius: 6, marginBottom: 8 }}>
              <b>{c.title}</b>
              <p style={{ margin: '6px 0' }}>
                Audience: {c.audience} | Status: {c.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button type="button" style={btnStyle} onClick={() => setPage('Home')}>
        Back to Home
      </button>
    </div>
  );
}

export default FacultyPortal;


