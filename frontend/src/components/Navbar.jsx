import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ serviceStats, toggleSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="menu-btn" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="navbar-title">Service Inventory Management</h1>
        <div className="navbar-actions">
          <span className="stat">Active Services: {serviceStats.active}</span>
          <button className="logout-btn" onClick={() => alert('Logout functionality not implemented')}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;