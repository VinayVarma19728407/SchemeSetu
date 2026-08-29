import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import { FaBookmark, FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaTasks, FaFolderOpen, FaTachometerAlt } from 'react-icons/fa';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, token, isAdmin } = useContext(AuthContext);
  const { bookmarks } = useContext(BookmarkContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo and Identity */}
        <Link to="/" className="navbar-logo-link" onClick={() => setMobileMenuOpen(false)}>
          <div className="gov-flag-badge">
            <span className="saffron"></span>
            <span className="white"></span>
            <span className="green"></span>
          </div>
          <div className="logo-text-group">
            <span className="logo-subtext">Government of India</span>
            <span className="logo-maintext">SchemeSetu</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/browse" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Browse Schemes</NavLink>
          <NavLink to="/find-schemes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Find Schemes for Me</NavLink>

          {token && !isAdmin && (
            <>
              <NavLink to="/bookmarks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <FaBookmark className="nav-icon" /> Bookmarks 
                {bookmarks.length > 0 && <span className="nav-badge">{bookmarks.length}</span>}
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
            </>
          )}

          {token && isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link admin-nav active' : 'nav-link admin-nav'}>
              <FaTachometerAlt className="nav-icon" /> Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Profile / Auth Controls */}
        <div className="navbar-auth-controls">
          {token ? (
            <div className="user-profile-menu">
              <span className="user-name">Hello, {user?.name || 'User'}</span>
              {!isAdmin && (
                <Link to="/profile" className="profile-btn-link" title="My Profile">
                  <FaUserCircle className="profile-icon" />
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="signup-btn">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button className="mobile-menu-trigger" onClick={toggleMobileMenu} aria-label="Toggle Menu">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Menu</h3>
          <button className="drawer-close" onClick={toggleMobileMenu}><FaTimes /></button>
        </div>
        <nav className="mobile-nav">
          <NavLink to="/" end className="mobile-nav-link" onClick={toggleMobileMenu}>Home</NavLink>
          <NavLink to="/browse" className="mobile-nav-link" onClick={toggleMobileMenu}>Browse Schemes</NavLink>
          <NavLink to="/find-schemes" className="mobile-nav-link" onClick={toggleMobileMenu}>Find Schemes for Me</NavLink>

          {token && !isAdmin && (
            <>
              <NavLink to="/bookmarks" className="mobile-nav-link" onClick={toggleMobileMenu}>
                Bookmarks ({bookmarks.length})
              </NavLink>
              <NavLink to="/dashboard" className="mobile-nav-link" onClick={toggleMobileMenu}>Dashboard</NavLink>
              <NavLink to="/profile" className="mobile-nav-link" onClick={toggleMobileMenu}>My Profile</NavLink>
            </>
          )}

          {token && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className="mobile-nav-link" onClick={toggleMobileMenu}>Admin Dashboard</NavLink>
              <NavLink to="/admin/manage-schemes" className="mobile-nav-link" onClick={toggleMobileMenu}>Manage Schemes</NavLink>
            </>
          )}

          {token ? (
            <button onClick={handleLogout} className="mobile-logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="mobile-auth-links">
              <Link to="/login" className="mobile-login-link" onClick={toggleMobileMenu}>Login</Link>
              <Link to="/signup" className="mobile-signup-btn" onClick={toggleMobileMenu}>Register</Link>
            </div>
          )}
        </nav>
      </div>
      {mobileMenuOpen && <div className="drawer-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
};

export default Navbar;
