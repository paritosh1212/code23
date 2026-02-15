import React, { useEffect, useState } from 'react';
import api from '../../api/client';

function AdminPortal({ setPage }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notices, setNotices] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const adminName = typeof window !== 'undefined' ? localStorage.getItem('demoUserName') || 'Admin' : 'Admin';

  function loadNotices() {
    api
      .get('/admin/notices')
      .then((res) => {
        setNotices(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        alert('Notices load failed');
      });
  }

  function loadAttendance() {
    api
      .get('/attendance-overview')
      .then((res) => {
        setAttendance(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        alert('Attendance load failed');
      });
  }

  useEffect(() => {
    loadNotices();
    loadAttendance();
  }, []);

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  let totalPresent = 0;
  let totalStudents = 0;
  attendance.forEach((row) => {
    totalPresent += row.present || 0;
    totalStudents += row.total || 0;
  });

  function addNotice(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Title and message required');
      return;
    }

    api
      .post('/admin/notices', {
        title: title.trim(),
        message: message.trim(),
        priority,
      })
      .then((res) => {
        if (res.data && res.data.notice) {
          setNotices([res.data.notice, ...notices]);
        } else {
          loadNotices();
        }
        setTitle('');
        setMessage('');
        alert('Notice published');
      })
      .catch(() => {
        alert('Notice publish failed');
      });
  }

  const pageStyle = { backgroundColor: 'transparent', minHeight: '100vh', padding: 20, fontFamily: 'Arial, sans-serif' };
  const cardStyle = { background: '#fff', border: '1px solid #d9e4f5', borderRadius: 8, padding: 12, marginBottom: 12 };
  const inputStyle = { width: '100%', padding: 8, marginBottom: 8 };
  const btnStyle = { padding: '8px 12px', backgroundColor: '#2b67c9', color: '#fff', border: 'none', cursor: 'pointer' };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
      <p>Welcome, {adminName}</p>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Add Notice (DB)</h3>
        <form onSubmit={addNotice}>
          <input style={inputStyle} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea style={inputStyle} rows={3} placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <select style={inputStyle} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button type="submit" style={btnStyle}>
            Publish
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Notice List</h3>
        <button type="button" style={{ ...btnStyle, marginBottom: 8 }} onClick={loadNotices}>
          Refresh Notices
        </button>
        {notices.length === 0 ? (
          <p>No notices.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {notices.map((n) => (
              <li key={n._id || n.id} style={{ marginBottom: 6 }}>
                <b>{n.title}</b> ({n.priority}) - {n.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Attendance</h3>
        <p>
          Overall: {totalPresent}/{totalStudents}
        </p>
        <button type="button" style={{ ...btnStyle, marginBottom: 8 }} onClick={loadAttendance}>
          Refresh Attendance
        </button>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: 8 }}>Branch</th>
              <th style={{ padding: 8 }}>Present</th>
              <th style={{ padding: 8 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((row) => (
              <tr key={row.branch}>
                <td style={{ padding: 8 }}>{row.branch}</td>
                <td style={{ padding: 8 }}>{row.present}</td>
                <td style={{ padding: 8 }}>{row.total}</td>
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

export default AdminPortal;
