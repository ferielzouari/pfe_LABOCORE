import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from './PageTransition';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex: 9,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-content-wrapper">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
