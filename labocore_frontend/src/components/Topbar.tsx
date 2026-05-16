import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../auth/AuthProvider';
import CommandPalette from './ui/CommandPalette';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const navigate                              = useNavigate();
  const { language, setLanguage, t }          = useLanguage();
  const { theme, toggleTheme }                = useTheme();
  const { user, logout }                      = useAuth();
  const [showLang, setShowLang]               = useState(false);
  const [showProfile, setShowProfile]         = useState(false);
  const [cmdOpen, setCmdOpen]                 = useState(false);

  const languages = ['EN', 'FR', 'AR'] as const;

  /* Global Ctrl+K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* Close dropdowns when clicking outside */
  useEffect(() => {
    if (!showLang && !showProfile) return;
    const handler = () => { setShowLang(false); setShowProfile(false); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showLang, showProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="topbar-floating">
        {/* Left: Logo */}
        <div className="topbar-logo-section">
          <button
            className="mobile-menu-btn"
            onClick={onMenuClick}
            style={{ display: 'none' }}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="logo-badge" onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18h8"/>
              <path d="M3 22h18"/>
              <path d="M14 22a7 7 0 1 0 0-14h-1"/>
              <path d="M9 14h2"/>
              <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
              <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <span className="brand-text">LABOCORE</span>
        </div>

        {/* Center: Command Palette trigger */}
        <div className="topbar-search-wrapper">
          <button className="cp-trigger" onClick={() => setCmdOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search pages &amp; commands…
            <span className="cp-trigger-shortcut">
              <kbd>Ctrl</kbd><kbd>K</kbd>
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="topbar-actions-section">
          {/* Language */}
          <div
            className="language-toggle"
            onClick={(e) => { e.stopPropagation(); setShowLang((v) => !v); }}
          >
            <button className="lang-btn" title="Select language">{language}</button>
            {showLang && (
              <div className="lang-dropdown">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className={`lang-option ${lang === language ? 'active' : ''}`}
                    onClick={() => { setLanguage(lang); setShowLang(false); }}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1"  x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12"   x2="3"  y2="12" /><line x1="21"  y1="12"  x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Notifications */}
          <div className="notification-wrapper">
            <button className="icon-btn notification-btn" title={t('notifications')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notification-badge">3</span>
            </button>
          </div>

          {/* User profile */}
          <div className="user-profile-wrapper" onClick={(e) => { e.stopPropagation(); setShowProfile((v) => !v); }}>
            <div className="user-profile-modern">
              <div className="profile-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="profile-info">
                <span className="profile-role">{user?.role || 'Admin'}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.4, transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <span className="profile-dropdown-name">{user?.name || 'Admin User'}</span>
                  <span className="profile-dropdown-email">
                    {user?.role === 'admin' ? 'admin@labocore.com' : 'user@labocore.com'}
                  </span>
                </div>
                <div className="profile-dropdown-body">
                  <button
                    className="profile-dropdown-item"
                    onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  >
                    <svg className="profile-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile Settings
                  </button>
                  <button className="profile-dropdown-item logout" onClick={handleLogout}>
                    <svg className="profile-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Topbar;
