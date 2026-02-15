import React, { useEffect, useState } from 'react';

function ParentsPortal({ setPage }) {
  const parentName = typeof window !== 'undefined' ? localStorage.getItem('demoUserName') || 'Parent' : 'Parent';

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  const [feesStatus] = useState({ paid: 42000, total: 60000 });
  const [attendance] = useState({ present: 47, total: 56 });
  const [result] = useState({ percentage: 81.4, rank: 6 });

  const pendingFees = feesStatus.total - feesStatus.paid;
  const attendancePercent = attendance.total === 0 ? 0 : Math.round((attendance.present / attendance.total) * 100);

  const pageStyle = { backgroundColor: 'transparent', minHeight: '100vh', padding: 20, fontFamily: 'Arial, sans-serif' };
  const cardStyle = { background: '#fff', border: '1px solid #d9e4f5', borderRadius: 8, padding: 12, marginBottom: 12 };
  const btnStyle = { padding: '8px 12px', backgroundColor: '#2b67c9', color: '#fff', border: 'none', cursor: 'pointer' };

  return (
    <div style={pageStyle}>
      <h2 style={{ marginTop: 0 }}>Parents Dashboard</h2>
      <p>Welcome, {parentName}</p>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Quick Links</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" style={btnStyle} onClick={() => setPage('Attendance')}>
            Attendance
          </button>
          <button type="button" style={btnStyle} onClick={() => setPage('Fees')}>
            Fees
          </button>
          <button type="button" style={btnStyle} onClick={() => setPage('Result')}>
            Result
          </button>
          <button type="button" style={btnStyle} onClick={() => setPage('Circular')}>
            Circular
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Ward Snapshot</h3>
        <p>
          Attendance: {attendance.present}/{attendance.total} ({attendancePercent}%)
        </p>
        <p>
          Fees Paid: Rs. {feesStatus.paid} / Rs. {feesStatus.total} | Pending: Rs. {pendingFees}
        </p>
        <p>
          Latest Result: {result.percentage}% | Class Rank: {result.rank}
        </p>
      </div>

      <button type="button" style={btnStyle} onClick={() => setPage('Home')}>
        Back to Home
      </button>
    </div>
  );
}

export default ParentsPortal;
