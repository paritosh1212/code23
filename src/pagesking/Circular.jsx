import { useEffect, useState } from 'react';
import api from '../api/client';

function Circular() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    setLoading(true);
    try {
      const res = await api.get('/admin/notices');
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch {
      alert('Failed to load circulars');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }

  function getNoticeStyle(priority) {
    if (priority === 'High') {
      return { backgroundColor: '#ffe7a8', border: '1px solid #bd8b21' };
    }
    if (priority === 'Low') {
      return { backgroundColor: '#e4ffd9', border: '1px solid #70a864' };
    }
    return { backgroundColor: '#dff0ff', border: '1px solid #5f95c4' };
  }

  return (
    <div style={{ minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>Campus Circulars</h1>

      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={loadNotices}>
          Refresh
        </button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {loading ? (
          <p>Loading...</p>
        ) : notices.length === 0 ? (
          <p>No circulars yet.</p>
        ) : (
          notices.map((notice) => {
            const cardStyle = getNoticeStyle(notice.priority);
            return (
              <div
                key={notice._id}
                style={{
                  ...cardStyle,
                  borderRadius: '6px',
                  padding: '14px',
                  marginBottom: '12px',
                  textAlign: 'left',
                }}
              >
                <h3 style={{ margin: '0 0 6px', color: '#1f3558' }}>{notice.title}</h3>
                <p style={{ margin: '0 0 6px', color: '#2b3f63' }}>{notice.message}</p>
                <small style={{ color: '#334e75' }}>
                  Priority: {notice.priority || 'Medium'} | Date: {new Date(notice.createdAt).toLocaleDateString()}
                </small>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Circular;
