import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaListAlt, 
  FaPlusCircle, 
  FaFolder, 
  FaUsers, 
  FaCog, 
  FaExternalLinkAlt, 
  FaSignOutAlt, 
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext.jsx';
import './AdminSidebar.css';

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {mobileOpen && <div className="admin-sidebar-overlay" onClick={onClose}></div>}
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <FaShieldAlt className="admin-brand-icon" />
            <div>
              <span className="admin-brand-title">SchemeSetu</span>
              <span className="admin-brand-badge">ADMIN</span>
            </div>
          </div>
          {mobileOpen && (
            <button className="admin-sidebar-close" onClick={onClose}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="admin-user-info">
          <div className="admin-user-avatar">
            {(user?.name || 'Admin').charAt(0).toUpperCase()}
          </div>
          <div className="admin-user-meta">
            <strong>{user?.name || 'Administrator'}</strong>
            <span>{user?.email || 'admin@schemesetu.gov'}</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          <div className="admin-menu-label">Main Navigation</div>
          <NavLink 
            to="/admin/dashboard" 
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaTachometerAlt className="admin-nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/manage-schemes" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaListAlt className="admin-nav-icon" />
            <span>Manage Schemes</span>
          </NavLink>

          <NavLink 
            to="/admin/add-scheme" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaPlusCircle className="admin-nav-icon" />
            <span>Add New Scheme</span>
          </NavLink>

          <div className="admin-menu-label">System Directory</div>
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaFolder className="admin-nav-icon" />
            <span>Categories</span>
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaUsers className="admin-nav-icon" />
            <span>Registered Users</span>
          </NavLink>

          <div className="admin-menu-label">Preferences</div>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FaCog className="admin-nav-icon" />
            <span>Settings & Security</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-link-public">
            <FaExternalLinkAlt /> Public Portal
          </a>
          <button onClick={handleLogout} className="admin-logout-trigger">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
