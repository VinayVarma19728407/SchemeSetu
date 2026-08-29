import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import { AuthContext } from '../../context/AuthContext.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ schemes: 0, users: 0, bookmarks: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/dashboard');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleManageSchemes = () => {
    navigate('/admin/manage-schemes');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) return <div className="admin-dashboard-loading">Loading admin dashboard…</div>;
  if (error) return <div className="admin-dashboard-error">{error}</div>;

  return (
    <div className="admin-dashboard-wrapper">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Schemes</h3>
          <p>{stats.schemes}</p>
        </div>
        <div className="admin-stat-card">
          <h3>Registered Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="admin-stat-card">
          <h3>Total Bookmarks</h3>
          <p>{stats.bookmarks}</p>
        </div>
      </div>
      <div className="admin-actions">
        <button className="admin-btn" onClick={handleManageSchemes}>Manage Schemes</button>
        <button className="admin-btn admin-logout" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
