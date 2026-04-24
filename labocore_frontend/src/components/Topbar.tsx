import React from 'react';
import { useLocation } from 'react-router-dom';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();

  // Create breadcrumb from path
  const path = location.pathname;
  const title = path === '/' ? 'Dashboard' : path.charAt(1).toUpperCase() + path.slice(2);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{title}</span>
      </div>

      <div className="topbar-right">
        <div className="search-input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--text-muted)">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search samples, suppliers, etc..." />
        </div>

        <div className="user-profile">
          <div className="avatar">JD</div>
          <div style={{ display: 'none' }} className="user-details">
             {/* We can hide details on mobile if needed */}
             <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>John Doe</div>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lab Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
