import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main-content-wrapper">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
