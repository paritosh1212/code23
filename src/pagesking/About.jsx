import { useEffect } from 'react';

function About() {
  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  return (
    <div
      style={{
        padding: '20px',
        minHeight: '100vh',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#12f251',
      }}
    >
      <h1>About EduCampus</h1>

      <div
        style={{
          maxWidth: '700px',
          margin: '20px auto',
          backgroundColor: '#ffffff',
          border: '1px solid #999',
          borderRadius: '6px',
          padding: '18px',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffe4b8',
            border: '1px solid #d9a441',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: '0 0 8px', color: '#7a4a00' }}>Our History</h3>
          <p style={{ margin: '0 0 6px', color: '#5c3d07' }}>EduCampus started in 1995.</p>
          <p style={{ margin: 0, color: '#5c3d07' }}>Now it has Engineering, MBA and Pharmacy courses.</p>
        </div>

        <div
          style={{
            backgroundColor: '#d9f3ff',
            border: '1px solid #6ca8c2',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: '0 0 8px', color: '#124b63' }}>Vision</h3>
          <p style={{ margin: 0, color: '#124b63' }}>Give practical and industry-ready education to students.</p>
        </div>

        <div
          style={{
            backgroundColor: '#e4ffd9',
            border: '1px solid #73b064',
            borderRadius: '6px',
            padding: '12px',
          }}
        >
          <h3 style={{ margin: '0 0 8px', color: '#2f6c22' }}>Mission</h3>
          <p style={{ margin: 0, color: '#2f6c22' }}>
            Use one platform where students, teachers and parents can work together.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
