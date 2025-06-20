import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, serviceStats }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <button className="close-btn" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-link" onClick={toggleSidebar}>
          Home
        </NavLink>
        <NavLink to="/create" className="nav-link" onClick={toggleSidebar}>
          Create Service
        </NavLink>
      </nav>
      <div className="sidebar-stats">
        <h3>Service Statistics</h3>
        <p>Total Services: {serviceStats.total}</p>
        <p>Active: {serviceStats.active}</p>
        <p>Inactive: {serviceStats.inactive}</p>
        <p>Terminated: {serviceStats.terminated}</p>
      </div>
    </aside>
  );
}

export default Sidebar;