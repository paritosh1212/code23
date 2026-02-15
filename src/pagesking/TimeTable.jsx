import { useEffect, useState } from 'react';

const timeTableData = {
  Engineering: [
    { day: 'Monday', s1: 'Maths IV', s2: 'Software Eng.', s3: 'React Lab' },
    { day: 'Tuesday', s1: 'Comp. Graphics', s2: 'DBMS', s3: 'C++ Coding' },
    { day: 'Wednesday', s1: '5G Tech', s2: 'Network Security', s3: 'Project Lab' },
    { day: 'Thursday', s1: 'Machine Learning', s2: 'AI', s3: 'Seminar' },
    { day: 'Friday', s1: 'Embedded Systems', s2: 'Java', s3: 'Sports/Club' },
  ],
  MBA: [
    { day: 'Monday', s1: 'Business Comm.', s2: 'Economics', s3: 'Case Study' },
    { day: 'Tuesday', s1: 'Marketing', s2: 'HR Management', s3: 'Group Task' },
    { day: 'Wednesday', s1: 'Finance', s2: 'Operations', s3: 'Presentation' },
    { day: 'Thursday', s1: 'Digital Marketing', s2: 'Ethics', s3: 'Workshop' },
    { day: 'Friday', s1: 'Leadership', s2: 'Project Mgmt', s3: 'Networking' },
  ],
  Pharmacy: [
    { day: 'Monday', s1: 'Anatomy', s2: 'Chemistry', s3: 'Lab Analysis' },
    { day: 'Tuesday', s1: 'Pharmacology', s2: 'Biochem', s3: 'Practical' },
    { day: 'Wednesday', s1: 'Drug Delivery', s2: 'Pharma Ethics', s3: 'Lab Work' },
    { day: 'Thursday', s1: 'Biostatistics', s2: 'Jurisprudence', s3: 'Clinic Visit' },
    { day: 'Friday', s1: 'Microbiology', s2: 'Organic Chem', s3: 'Library' },
  ],
};

function TimeTable() {
  const [branch, setBranch] = useState('Engineering');
  const rows = timeTableData[branch];

  useEffect(() => {
    const oldBodyBackground = document.body.style.background;
    document.body.style.background = '#12f251';

    return () => {
      document.body.style.background = oldBodyBackground;
    };
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Time Table</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="branch-select">Choose Branch: </label>
        <select id="branch-select" value={branch} onChange={(e) => setBranch(e.target.value)} style={{ padding: '6px' }}>
          <option value="Engineering">Engineering</option>
          <option value="MBA">MBA</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
      </div>

      <h2>{branch} Schedule</h2>

      <table
        border="1"
        cellPadding="10"
        width="90%"
        style={{ margin: '0 auto', borderCollapse: 'collapse', backgroundColor: '#fff' }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: '#ffe7a8' }}>Day</th>
            <th style={{ backgroundColor: '#dff0ff' }}>10:00 - 11:00</th>
            <th style={{ backgroundColor: '#e4ffd9' }}>11:00 - 12:00</th>
            <th style={{ backgroundColor: '#f3ddff' }}>12:30 - 01:30</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.day}>
              <td>{row.day}</td>
              <td>{row.s1}</td>
              <td>{row.s2}</td>
              <td>{row.s3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;
