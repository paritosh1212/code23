import { useEffect, useState } from 'react';
import api from '../api/client';

const events = [
  { name: 'Cultural Fest', color: '#ffd166' },
  { name: 'Robo War', color: '#a0c4ff' },
  { name: 'Sports Week', color: '#caffbf' },
];

function Event() {
  const [eventName, setEventName] = useState(events[0].name);
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadParticipants();
  }, []);

  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  async function loadParticipants() {
    setIsLoading(true);
    try {
      const res = await api.get('/event-participants');
      setParticipants(res.data);
    } catch {
      alert('Failed to load participants');
    } finally {
      setIsLoading(false);
    }
  }

  async function joinEvent() {
    if (name.trim() === '') {
      alert('Enter student name');
      return;
    }

    try {
      await api.post('/event-participants', {
        name: name.trim(),
        event: eventName,
      });
      alert('Joined successfully');
      setName('');
      loadParticipants();
    } catch {
      alert('Registration failed');
    }
  }

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        textAlign: 'center',
        fontFamily: 'Arial',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          border: '1px solid #999',
          borderRadius: '6px',
          padding: '20px',
        }}
      >
        <h1 style={{ marginTop: 0 }}>Campus Events</h1>
        <p>Simple event join page</p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          {events.map((item) => (
            <button
              key={item.name}
              onClick={() => setEventName(item.name)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: eventName === item.name ? '2px solid #333' : '1px solid #777',
                backgroundColor: item.color,
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <select
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{ padding: '8px', marginRight: '8px' }}
          >
            {events.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', marginRight: '8px' }}
          />

          <button onClick={joinEvent} style={{ padding: '8px 12px' }}>
            Join Event
          </button>
        </div>

        <h2>Participant List</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table
            border="1"
            width="100%"
            cellPadding="8"
            style={{ borderCollapse: 'collapse', backgroundColor: '#ffffff' }}
          >
            <thead>
              <tr>
                <th style={{ backgroundColor: '#dff0ff' }}>Student</th>
                <th style={{ backgroundColor: '#ffe7a8' }}>Event</th>
                <th style={{ backgroundColor: '#e4ffd9' }}>Time</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#ffffff' }}>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                    No participants yet
                  </td>
                </tr>
              ) : (
                participants.map((item) => (
                  <tr key={item._id} style={{ backgroundColor: '#ffffff' }}>
                    <td style={{ color: '#000000' }}>{item.name}</td>
                    <td style={{ color: '#000000' }}>{item.event}</td>
                    <td style={{ color: '#000000' }}>{item.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Event;
