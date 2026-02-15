import React, { useEffect, useState } from 'react';
import api from '../api/client';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  function send() {
    if (name.trim() === '' || email.trim() === '' || msg.trim() === '') {
      alert('Please fill name, email and message');
      return;
    }

    api
      .post('/contact', {
        name: name.trim(),
        email: email.trim(),
        message: msg.trim(),
      })
      .then(() => {
        alert('Message sent successfully');
        setName('');
        setEmail('');
        setMsg('');
      })
      .catch(() => {
        alert('Failed to send message');
      });
  }

  return (
    <div
      style={{
        padding: '24px 12px 32px',
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#12f251',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginTop: 0, color: '#1f3558' }}>Contact Us</h1>
      <p style={{ color: '#26496e', marginTop: 0 }}>We are here to help you</p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
        <div style={{ backgroundColor: '#ffe7a8', border: '1px solid #bd8b21', borderRadius: '8px', padding: '12px 16px', minWidth: '220px' }}>
          <strong>Phone</strong>
          <p style={{ margin: '6px 0 0' }}>9876543210</p>
        </div>
        <div style={{ backgroundColor: '#dff0ff', border: '1px solid #5f95c4', borderRadius: '8px', padding: '12px 16px', minWidth: '220px' }}>
          <strong>Email</strong>
          <p style={{ margin: '6px 0 0' }}>contact@college.edu</p>
        </div>
        <div style={{ backgroundColor: '#e4ffd9', border: '1px solid #70a864', borderRadius: '8px', padding: '12px 16px', minWidth: '220px' }}>
          <strong>Address</strong>
          <p style={{ margin: '6px 0 0' }}>Nashik</p>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #a67c00',
          backgroundColor: '#fff5cc',
          borderRadius: '10px',
          padding: '18px',
          width: '380px',
          maxWidth: '94%',
          margin: '22px auto 0',
          textAlign: 'left',
        }}
      >
        <h3 style={{ marginTop: 0, textAlign: 'center', color: '#1f3558' }}>Send Message</h3>
        <label htmlFor="contact-name">Your Name</label>
        <input
          id="contact-name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '6px', marginBottom: '10px', border: '1px solid #9e8847', backgroundColor: '#fffdf2' }}
        />

        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '6px', marginBottom: '10px', border: '1px solid #9e8847', backgroundColor: '#fffdf2' }}
        />

        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          placeholder="Write your message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows="4"
          style={{ width: '100%', padding: '8px', marginTop: '6px', marginBottom: '12px', border: '1px solid #9e8847', backgroundColor: '#fffdf2' }}
        />

        <button
          onClick={send}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #1e5c2a',
            borderRadius: '4px',
            backgroundColor: '#45bf55',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Contact;
