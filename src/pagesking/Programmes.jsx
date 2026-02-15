import React from 'react';

function Programmes() {
  const courses = [
    { name: 'Computer Engineering', color: '#dff0ff', border: '#5f95c4' },
    { name: 'Mechanical Engineering', color: '#ffe7a8', border: '#bd8b21' },
    { name: 'Civil Engineering', color: '#e4ffd9', border: '#70a864' },
    { name: 'MBA', color: '#f3ddff', border: '#9a66b8' },
    { name: 'Pharmacy', color: '#ffdfe1', border: '#b96b74' },
  ];

  return (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <style>{`body { background: #12f251; }`}</style>
      <h1>Courses</h1>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '20px auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          maxWidth: '900px',
        }}
      >
        {courses.map((course) => (
          <li
            key={course.name}
            style={{
              width: '260px',
              minHeight: '110px',
              border: `2px solid ${course.border}`,
              borderRadius: '60px',
              backgroundColor: course.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Programmes;
