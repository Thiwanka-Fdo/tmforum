import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ serviceStats, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <button className="menu-btn" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1>TMF638 Admin Dashboard</h1>
        <div className="stats">
          <span className="stat">Active Services: {serviceStats.active}</span>
          <button className="logout-btn" onClick={() => alert('Logout functionality not implemented')}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;