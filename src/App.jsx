import { useMemo, useState } from 'react';
import './App.css';
import About from './pagesking/About';
import Assignment from './pagesking/Assignment';
import Attendance from './pagesking/Attendance';
import Circular from './pagesking/Circular';
import Contact from './pagesking/Contact';
import Event from './pagesking/Event';
import Fees from './pagesking/Fees';
import Home from './pagesking/Home';
import Programmes from './pagesking/Programmes';
import Result from './pagesking/Result';
import TimeTable from './pagesking/TimeTable';
import { AdminPortal, FacultyPortal, ParentsPortal, StudentPortal } from './pagesking/roleHub';

const navItems = [
  { key: 'Home', label: 'Home' },
  { key: 'About', label: 'About' },
  { key: 'Programmes', label: 'Programmes' },
  { key: 'Contact', label: 'Contact' },
];

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderedPage = useMemo(() => {
    switch (currentPage) {
      case 'Home':
        return <Home setPage={setCurrentPage} />;
      case 'About':
        return <About />;
      case 'Programmes':
        return <Programmes />;
      case 'Contact':
        return <Contact />;
      case 'Attendance':
        return <Attendance />;
      case 'Fees':
        return <Fees setPage={setCurrentPage} />;
      case 'Assignment':
        return <Assignment />;
      case 'Result':
        return <Result />;
      case 'Event':
        return <Event />;
      case 'TimeTable':
        return <TimeTable />;
      case 'Circular':
        return <Circular />;
      case 'Admin':
      case 'AdminPortal':
        return <AdminPortal setPage={setCurrentPage} />;
      case 'FacultyPortal':
        return <FacultyPortal setPage={setCurrentPage} />;
      case 'StudentPortal':
        return <StudentPortal setPage={setCurrentPage} />;
      case 'ParentsPortal':
        return <ParentsPortal setPage={setCurrentPage} />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  }, [currentPage]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <button className="logo logo-btn" onClick={() => setCurrentPage('Home')}>
          EduCampus
        </button>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                className={`nav-btn ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="main-content">
        {currentPage !== 'Home' ? (
          <button className="back-btn" onClick={() => setCurrentPage('Home')}>
            Back to dashboard
          </button>
        ) : null}
        {renderedPage}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>EduCampus</h3>
            <p>Integrated academic platform for students, faculty, and parents.</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>Attendance</li>
              <li>Assignments</li>
              <li>Results</li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact</h3>
            <p>Gangapur Road, Nashik</p>
            <p>contact@educampus.edu</p>
          </div>
        </div>
        <div className="copyright">Copyright 2026 EduCampus. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
