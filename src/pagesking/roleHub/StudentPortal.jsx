import React, { useEffect, useState } from 'react';

function StudentPortal({ setPage }) {
  const studentName = typeof window !== 'undefined' ? localStorage.getItem('demoUserName') || 'Student' : 'Student';

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Software Engineering Unit Test', due: '2026-02-18', submitted: false },
    { id: 2, title: 'Machine Learning Notebook', due: '2026-02-21', submitted: false },
    { id: 3, title: 'Graphics Mini Project', due: '2026-02-24', submitted: true },
  ]);

  const [attendance, setAttendance] = useState({ present: 46, total: 54 });

  const [results] = useState([
    { subject: 'Software Engineering', marks: 84 },
    { subject: 'Machine Learning', marks: 81 },
    { subject: 'Computer Graphics', marks: 76 },
    { subject: '5G Technology', marks: 79 },
  ]);

  let submittedCount = 0;
  assignments.forEach((a) => {
    if (a.submitted) submittedCount += 1;
  });
  const pendingCount = assignments.length - submittedCount;

  const attendancePercent = attendance.total === 0 ? 0 : Math.round((attendance.present / attendance.total) * 100);

  let totalMarks = 0;
  results.forEach((r) => {
    totalMarks += r.marks;
  });
  const percentage = results.length === 0 ? 0 : (totalMarks / results.length).toFixed(2);
  const cgpa = results.length === 0 ? 0 : (totalMarks / results.length / 10).toFixed(2);

  function markSubmitted(id) {
    const updated = assignments.map((a) => {
      if (a.id === id) return { ...a, submitted: true };
      return a;
    });
    setAssignments(updated);
  }

  function markToday(status) {
    if (status === 'P') {
      setAttendance({ present: attendance.present + 1, total: attendance.total + 1 });
    } else {
      setAttendance({ present: attendance.present, total: attendance.total + 1 });
    }
  }

  const pageStyle = { backgroundColor: 'transparent', minHeight: '100vh', padding: 20, fontFamily: 'Arial, sans-serif' };
  const cardStyle = { background: '#fff', border: '1px solid #d9e4f5', borderRadius: 8, padding: 12, marginBottom: 12 };
  const btnStyle = { padding: '8px 12px', backgroundColor: '#2b67c9', color: '#fff', border: 'none', cursor: 'pointer' };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginTop: 0 }}>Student Dashboard</h2>
      <p>Welcome, {studentName}</p>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Quick Links</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" style={btnStyle} onClick={() => setPage('Assignment')}>
            Assignment
          </button>
          <button type="button" style={btnStyle} onClick={() => setPage('Attendance')}>
            Attendance
          </button>
          <button type="button" style={btnStyle} onClick={() => setPage('Result')}>
            Result
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Assignments</h3>
        <p>
          Submitted: {submittedCount} / {assignments.length} | Pending: {pendingCount}
        </p>
        {assignments.map((a) => (
          <div key={a.id} style={{ border: '1px solid #d9e4f5', padding: 8, borderRadius: 6, marginBottom: 8 }}>
            <b>{a.title}</b>
            <p style={{ margin: '6px 0' }}>Due: {a.due}</p>
            {a.submitted ? (
              <span>Submitted</span>
            ) : (
              <button type="button" style={btnStyle} onClick={() => markSubmitted(a.id)}>
                Mark Submitted
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Attendance</h3>
        <p>
          Present: {attendance.present}/{attendance.total} ({attendancePercent}%)
        </p>
        <button type="button" style={{ ...btnStyle, marginRight: 8 }} onClick={() => markToday('P')}>
          Mark Present
        </button>
        <button type="button" style={btnStyle} onClick={() => markToday('A')}>
          Mark Absent
        </button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Results</h3>
        <p>
          Percentage: {percentage}% | CGPA: {cgpa}
        </p>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>Subject</th>
              <th style={{ padding: 8 }}>Marks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.subject}>
                <td style={{ padding: 8 }}>{r.subject}</td>
                <td style={{ padding: 8 }}>{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" style={btnStyle} onClick={() => setPage('Home')}>
        Back to Home
      </button>
    </div>
  );
}

export default StudentPortal;
