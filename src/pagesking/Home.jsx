import { useEffect, useState } from 'react';
import '../App.css';
import { LOGIN_ROLES, getRoleLandingPage } from './roleHub';

function Home({ setPage }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('Student');
  const directLinks = [
    { label: 'Attendance', page: 'Attendance' },
    { label: 'Fees', page: 'Fees' },
    { label: 'Assignment', page: 'Assignment' },
    { label: 'Result', page: 'Result' },
    { label: 'Event', page: 'Event' },
    { label: 'Time Table', page: 'TimeTable' },
    { label: 'Circular', page: 'Circular' },
  ];

  function login() {
    if (user.trim() === '' || pass.trim() === '') {
      alert('Please enter details');
      return;
    }
    alert('Login Successful');
    setPage(getRoleLandingPage(role));
  }

  useEffect(() => {
    const previousBodyBackground = document.body.style.background;
    document.body.style.background = "#12f251 url('/home-bg.jpg') center/cover no-repeat fixed";

    return () => {
      document.body.style.background = previousBodyBackground;
    };
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px 10px 30px',
        width: '100%',
        minHeight: '100vh',
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          margin: 0,
          color: '#1f3558',
          padding: '8px 0',
          fontSize: '34px',
        }}
      >
        College Campus App
      </h1>

      <div
        style={{
          border: '2px solid #b18a00',
          padding: '20px',
          width: '320px',
          maxWidth: '94%',
          margin: '0 auto',
          backgroundColor: '#ffe9a8',
          borderRadius: '6px',
        }}
      >
        <h2 style={{ marginTop: 0, color: '#263d62' }}>Login</h2>

        <div style={{ margin: '10px 0' }}>
          <label style={{ color: '#2b3f63' }}>Select Role: </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              marginLeft: '8px',
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #777',
              backgroundColor: '#fff9e6',
            }}
          >
            {LOGIN_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{
            display: 'block',
            width: '90%',
            margin: '10px auto',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #888',
            backgroundColor: '#fffdf5',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{
            display: 'block',
            width: '90%',
            margin: '10px auto',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #888',
            backgroundColor: '#fffdf5',
          }}
        />

        <button
          onClick={login}
          style={{
            padding: '8px 16px',
            marginTop: '10px',
            border: '1px solid #1e5c2a',
            borderRadius: '4px',
            backgroundColor: '#45bf55',
            color: '#ffffff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '12px', color: '#253b5f' }}>Direct Links</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '760px', margin: '0 auto' }}>
          {directLinks.map((item) => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              style={{
                border: '1px solid #8b6f18',
                borderRadius: '4px',
                padding: '8px 12px',
                backgroundColor: '#ffe082',
                color: '#4f3d03',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
