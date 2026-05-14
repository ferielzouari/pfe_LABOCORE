import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../auth/AuthProvider';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const languages = ['EN', 'FR', 'AR'] as const;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/settings');
    setShowProfileDropdown(false);
  };

  return (
    <header className="topbar-floating" style={{ background: 'linear-gradient(90deg, #ffffff 0%, #f8fbff 100%)', boxShadow: '0 4px 20px rgba(59, 91, 219, 0.08)' }}>
      {/* Left Section: Logo and Brand */}
      <div className="topbar-logo-section">
        <div className="logo-badge" style={{ background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)' }}>
          <span style={{ fontSize: '1.125rem' }}>🔬</span>
        </div>
        <span className="brand-text" style={{ color: '#3b5bdb', fontWeight: 700 }}>LABOCORE</span>
      </div>

      {/* Center Section: Search Bar */}
      <div className="topbar-search-wrapper">
        <div className="search-input-modern">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder={t('search')} />
        </div>
      </div>

      {/* Right Section: Actions and Profile */}
      <div className="topbar-actions-section">
        {/* Language Toggle */}
        <div className="language-toggle" onClick={() => setShowLangDropdown(!showLangDropdown)}>
          <button className="lang-btn" title="Select language">
            {language}
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className={`lang-option ${lang === language ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLangDropdown(false);
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Light/Dark Mode Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        {/* Notification Bell */}
        <div className="notification-wrapper">
          <button className="icon-btn notification-btn" title={t('notifications')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge">3</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile-wrapper">
          <div className="user-profile-modern" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="profile-info">
              <span className="profile-role">{user?.role || 'admin'}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', opacity: 0.5 }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span className="profile-dropdown-name">{user?.name || 'Admin User'}</span>
                <span className="profile-dropdown-email">{user?.role === 'admin' ? 'admin@labocore.com' : 'user@labocore.com'}</span>
              </div>
              <div className="profile-dropdown-body">
                <button className="profile-dropdown-item" onClick={handleProfileClick}>
                  <svg className="profile-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile Settings
                </button>
                <button className="profile-dropdown-item logout" onClick={handleLogout}>
                  <svg className="profile-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
