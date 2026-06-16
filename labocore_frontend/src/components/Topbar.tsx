import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../auth/AuthProvider';
import CommandPalette from './ui/CommandPalette';
import { stockAlertsApi, StockAlertDto } from '../services/api';

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
  const [alerts, setAlerts]                   = useState<StockAlertDto[]>([]);
  const [showAlerts, setShowAlerts]           = useState(false);
  const [sendStatus, setSendStatus]           = useState<Record<string, 'sending' | 'sent' | 'failed'>>({});
  const [notifyAllStatus, setNotifyAllStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [notifyAllMessage, setNotifyAllMessage] = useState('');
  const alertsRef                             = useRef<HTMLDivElement>(null);

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

  /* Close alert dropdown when clicking outside */
  useEffect(() => {
    if (!showAlerts) return;
    const handler = (e: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAlerts]);

  /* Load alerts on mount and auto-send to suppliers with email */
  useEffect(() => {
    stockAlertsApi.getAlerts().then(data => {
      setAlerts(data);
      data.forEach(alert => {
        if (alert.supplierEmail) {
          stockAlertsApi.notifySupplier(alert).catch(() => {});
        }
      });
    }).catch(() => {});
  }, []);

  const handleBellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showAlerts) {
      stockAlertsApi.getAlerts().then(setAlerts).catch(() => {});
    }
    setShowAlerts(v => !v);
  };

  const handleNotify = async (alert: StockAlertDto) => {
    setSendStatus(prev => ({ ...prev, [alert.codart]: 'sending' }));
    try {
      await stockAlertsApi.notifySupplier(alert);
      setSendStatus(prev => ({ ...prev, [alert.codart]: 'sent' }));
    } catch {
      setSendStatus(prev => ({ ...prev, [alert.codart]: 'failed' }));
    }
  };

  const handleNotifyAll = async () => {
    setNotifyAllStatus('sending');
    try {
      const result = await stockAlertsApi.notifyAll();
      setNotifyAllMessage(result.message);
      setNotifyAllStatus('success');
    } catch {
      setNotifyAllStatus('error');
    }
  };

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
          <div className="notification-wrapper" ref={alertsRef} style={{ position: 'relative' }}>
            <button className="icon-btn notification-btn" title={t('notifications')} onClick={handleBellClick}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {alerts.length > 0 && (
                <span className="notification-badge" style={{ backgroundColor: '#ef4444', color: 'white' }}>
                  {alerts.length}
                </span>
              )}
            </button>

            {showAlerts && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '380px',
                maxHeight: '480px',
                overflowY: 'auto',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-floating)',
                zIndex: 200,
                marginTop: '8px',
              }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'var(--surface-hover)',
                  borderTopLeftRadius: 'var(--radius-lg)',
                  borderTopRightRadius: 'var(--radius-lg)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>Stock Alerts</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Top 10 most critical articles</div>
                    </div>
                    {alerts.some(a => a.supplierEmail) && (
                      <button
                        onClick={handleNotifyAll}
                        disabled={notifyAllStatus === 'sending'}
                        style={{
                          fontSize: '0.6875rem', fontWeight: 600,
                          padding: '0.3rem 0.625rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--primary-color)',
                          background: 'transparent',
                          color: 'var(--primary-color)',
                          cursor: notifyAllStatus === 'sending' ? 'not-allowed' : 'pointer',
                          opacity: notifyAllStatus === 'sending' ? 0.7 : 1,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {notifyAllStatus === 'sending' ? 'Sending…' : 'Notify All Suppliers'}
                      </button>
                    )}
                  </div>
                  {notifyAllStatus === 'success' && (
                    <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.5rem', fontWeight: 600 }}>
                      {notifyAllMessage}
                    </div>
                  )}
                  {notifyAllStatus === 'error' && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem', fontWeight: 600 }}>
                      Failed — try again
                    </div>
                  )}
                </div>

                <div style={{ padding: '0.5rem' }}>
                  {alerts.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500 }}>
                      ✓ All stock levels are normal
                    </div>
                  ) : alerts.map(alert => {
                    const status = sendStatus[alert.codart];
                    const noEmail = !alert.supplierEmail;
                    return (
                      <div key={alert.codart} style={{
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.25rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--surface-color)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.875rem' }}>{alert.codart}</span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.02em' }}>
                            LOW STOCK
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontWeight: 500 }}>{alert.desart}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                          Current stock: <strong style={{ color: '#ef4444' }}>{alert.stkDep}</strong> units
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          {alert.supplierName ? (
                            <>
                              <div>{alert.supplierName}</div>
                              {alert.supplierEmail && <div style={{ color: 'var(--primary-color)' }}>{alert.supplierEmail}</div>}
                            </>
                          ) : (
                            <span style={{ fontStyle: 'italic' }}>No supplier linked</span>
                          )}
                        </div>
                        <button
                          disabled={noEmail || status === 'sending' || status === 'sent'}
                          onClick={() => handleNotify(alert)}
                          style={{
                            fontSize: '0.75rem', fontWeight: 600,
                            padding: '0.375rem 0.875rem',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            cursor: (noEmail || status === 'sending' || status === 'sent') ? 'not-allowed' : 'pointer',
                            background: status === 'sent' ? '#22c55e' : status === 'failed' ? '#ef4444' : status === 'sending' ? 'var(--primary-color)' : noEmail ? 'var(--surface-hover)' : 'var(--primary-color)',
                            color: noEmail && !status ? 'var(--text-muted)' : 'white',
                            opacity: status === 'sending' ? 0.7 : 1,
                            transition: 'background 0.2s',
                          }}
                        >
                          {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : status === 'failed' ? 'Failed — retry' : noEmail ? 'No email' : 'Send to Supplier'}
                        </button>
                        {noEmail && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.375rem' }}>
                            Article has no reception history. Link a supplier via Goods Reception to enable notifications.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
