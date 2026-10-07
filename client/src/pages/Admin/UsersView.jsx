import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaCheckCircle, 
  FaBookmark, 
  FaSync,
  FaShieldAlt,
  FaUserClock
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import adminService from '../../services/adminService.js';
import './AdminSubViews.css';

export const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setError('Unexpected response format from users API');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch registered citizens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
    (u.id && u.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totalBookmarks = users.reduce((acc, u) => acc + (u.bookmarksCount || 0), 0);
  const verifiedCount = users.filter(u => u.isVerified).length;

  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <AdminLayout 
      title="Registered Citizens" 
      subtitle="Overview of registered users, verification status, and scheme engagement"
    >
      <div className="admin-subview-container">
        {/* Metric Cards */}
        <div className="admin-subview-stats">
          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon blue">
              <FaUsers />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{users.length}</h3>
              <p>Total Registered Citizens</p>
            </div>
          </div>

          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{verifiedCount}</h3>
              <p>Verified Profiles</p>
            </div>
          </div>

          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon amber">
              <FaBookmark />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{totalBookmarks}</h3>
              <p>Total Schemes Bookmarked</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="admin-subview-header-row">
          <div className="admin-subview-search">
            <FaSearch className="admin-subview-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, email, or user ID..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn-view-schemes" 
            onClick={fetchUsers}
            disabled={loading}
          >
            <FaSync className={loading ? 'fa-spin' : ''} /> Refresh
          </button>
        </div>

        {error && <div className="admin-alert error">{error}</div>}

        {/* Users Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading citizens list...</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Citizen Name</th>
                  <th>Email Address</th>
                  <th>User ID</th>
                  <th>Joined Date</th>
                  <th>Last Active</th>
                  <th>Bookmarks</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No citizens found matching "{search}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <span className="user-avatar-pill">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                        <strong>{user.name || 'Anonymous Citizen'}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td><code>{user.id}</code></td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#0284c7' }}>
                          {user.bookmarksCount || 0}
                        </span> saved
                      </td>
                      <td>
                        {user.isVerified ? (
                          <span className="badge-status-verified">Verified</span>
                        ) : (
                          <span className="badge-status-unverified">Unverified</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersView;
