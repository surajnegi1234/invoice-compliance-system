import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'auditor': return 'role-auditor';
      case 'vendor': return 'role-vendor';
      default: return '';
    }
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-content">
          <a href="/" className="header-brand">
            <div className="header-logo">IC</div>
            <h1 className="header-title">Invoice & Compliance</h1>
          </a>
          
          <nav className="header-nav">
            <div className="user-info">
              <span className={`user-role ${getRoleClass(user?.role)}`}>
                {user?.role}
              </span>
              <span className="user-name">{user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;