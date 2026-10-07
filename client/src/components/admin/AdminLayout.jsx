import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaPlus, FaShieldAlt } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar.jsx';
import './AdminLayout.css';

export const AdminLayout = ({ children, title = 'Administration', subtitle = '' }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="admin-hamburger" 
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open Sidebar"
            >
              <FaBars />
            </button>
            <div className="admin-page-titles">
              <h1 className="admin-header-title">{title}</h1>
              {subtitle && <p className="admin-header-subtitle">{subtitle}</p>}
            </div>
          </div>

          <div className="admin-topbar-right">
            <Link to="/admin/add-scheme" className="admin-btn-quick-add">
              <FaPlus /> <span>New Scheme</span>
            </Link>
            <div className="admin-badge-gov">
              <FaShieldAlt /> Central Portal
            </div>
          </div>
        </header>

        <main className="admin-content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
