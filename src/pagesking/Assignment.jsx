import React, { useEffect, useState } from 'react';
import api from '../api/client';

const branches = {
  Engineering: ['Software Engineering', 'Machine Learning', '5G Technology', 'Comp Graphics'],
  MBA: ['Marketing Mgmt', 'Business Analytics', 'HR Management', 'Finance'],
  Pharmacy: ['Pharmacology', 'Drug Analysis', 'Anatomy', 'Biochemistry'],
};

function Assignment() {
  const [selectedBranch, setSelectedBranch] = useState('Engineering');
  const [selectedSubject, setSelectedSubject] = useState('Software Engineering');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get('/getStudents', { params: { branch: selectedBranch } })
      .then(function(res) {
        const data = Array.isArray(res.data) ? res.data : [];
        setStudents(data.slice(0, 10));
        setLoading(false);
      })
      .catch(function() {
        alert('Unable to fetch students.');
        setLoading(false);
      });
  }, [selectedBranch]);

  useEffect(() => {
    if (branches[selectedBranch]) {
      setSelectedSubject(branches[selectedBranch][0]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  function handleFileUpload(e, studentId) {
    const file = e.target.files[0];
    if (!file || !selectedSubject) return;

    setStudents(function(oldList) {
      return oldList.map(function(s) {
        if (s._id === studentId) {
          return { ...s, fileStatus: 'uploading' };
        }
        return s;
      });
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    formData.append('subject', selectedSubject);

    api
      .post('/upload', formData)
      .then(function() {
        setStudents(function(oldList) {
          return oldList.map(function(s) {
            if (s._id === studentId) {
              return { ...s, fileStatus: 'done' };
            }
            return s;
          });
        });
      })
      .catch(function() {
        setStudents(function(oldList) {
          return oldList.map(function(s) {
            if (s._id === studentId) {
              return { ...s, fileStatus: 'failed' };
            }
            return s;
          });
        });
        alert('File upload failed.');
      });
  }

  function handleFinalSubmit() {
    let list = [];
    for (let i = 0; i < students.length; i++) {
      let s = students[i];
      if (s.fileStatus === 'done') {
        list.push({ studentName: s.name, rollNo: s.rollNo });
      }
    }

    if (list.length === 0) {
      alert('Upload at least one assignment before final submit.');
      return;
    }

    api
      .post('/submit-assignments', {
        branch: selectedBranch,
        subject: selectedSubject,
        submittedStudents: list,
      })
      .then(function() {
        alert('Final submit complete. Count: ' + list.length);
      })
      .catch(function() {
        alert('Final submit failed.');
      });
  }

  return (
    <div className="assignment-container">
      <style>{`
        .assignment-container { padding: 20px; text-align: center; font-family: sans-serif; min-height: 100vh; background-color: #12f251; }
        h1 { color: #333; }
        select { padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #ccc; margin: 0 10px; }
        table { width: 80%; margin: 20px auto; border-collapse: collapse; background-color: lightyellow; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        th { background-color: #007bff; color: white; padding: 10px; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .btn { padding: 5px 10px; margin: 0 5px; border: none; color: white; cursor: pointer; border-radius: 3px; }
        .btn-upload { background-color: #28a745; }
        .btn-save { padding: 10px 20px; background-color: darkblue; font-size: 16px; margin-top: 20px; color: white; border: none; cursor: pointer; border-radius: 5px; }
        .status-done { color: green; font-weight: bold; }
        .status-uploading { color: orange; }
      `}</style>
      <h1>Assignment Submission</h1>
      
      <div>
        <select value={selectedBranch} onChange={function(e) { setSelectedBranch(e.target.value); }}>
          {Object.keys(branches).map(function(b) {
            return <option key={b} value={b}>{b}</option>;
          })}
        </select>

        <select value={selectedSubject} onChange={function(e) { setSelectedSubject(e.target.value); }}>
          {branches[selectedBranch]?.map(function(s) {
            return <option key={s} value={s}>{s}</option>;
          })}
        </select>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Roll No</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4">Loading...</td></tr>
          ) : (
            students.map(function(student, index) {
              let status = student.fileStatus;
              return (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>
                    {status === 'done' ? (
                      <span className="status-done">Uploaded</span>
                    ) : status === 'uploading' ? (
                      <span className="status-uploading">Uploading...</span>
                    ) : (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button className="btn btn-upload">Upload</button>
                        <input
                          type="file"
                          onChange={function(e) { handleFileUpload(e, student._id); }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      
      <button className="btn btn-save" onClick={handleFinalSubmit}>Final Submit All</button>
    </div>
  );
}

export default Assignment;
