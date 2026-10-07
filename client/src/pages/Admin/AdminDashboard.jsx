import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUniversity, 
  FaUsers, 
  FaBookmark, 
  FaFolder, 
  FaPlus, 
  FaCheckCircle, 
  FaArrowRight, 
  FaEye, 
  FaHistory, 
  FaChartBar,
  FaFileAlt
} from 'react-icons/fa';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import adminService from '../../services/adminService.js';
import './AdminDashboard.css';

const CHART_COLORS = [
  '#0b3d91', '#1e88e5', '#f57c00', '#2e7d32', '#6a1b9a', 
  '#00838f', '#d84315', '#ad1457', '#4527a0', '#283593'
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setError(res.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to connect to admin services');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="System Dashboard" subtitle="Loading administrative analytics...">
        <div className="admin-loading-view">
          <div className="admin-spinner"></div>
          <p>Compiling database statistics and records...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout title="System Dashboard">
        <div className="admin-error-view">
          <p>{error || 'Unable to load statistics'}</p>
          <button onClick={() => window.location.reload()} className="btn-retry">Reload</button>
        </div>
      </AdminLayout>
    );
  }

  // Prep chart data (top 8 categories)
  const chartData = (stats.categoryDistribution || [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <AdminLayout 
      title="Administrator Overview" 
      subtitle="Comprehensive Central Government Scheme analytics and management"
    >
      <div className="dashboard-content">
        {/* KPI Cards Grid */}
        <div className="admin-kpi-grid">
          <div className="kpi-card" onClick={() => navigate('/admin/manage-schemes')}>
            <div className="kpi-icon-wrapper blue">
              <FaUniversity />
            </div>
            <div className="kpi-text">
              <span className="kpi-label">Total Schemes</span>
              <h2 className="kpi-value">{stats.totalSchemes}</h2>
              <span className="kpi-subtext">
                <strong className="text-success">{stats.activeSchemes || stats.totalSchemes}</strong> active • {stats.inactiveSchemes || 0} drafts
              </span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/admin/users')}>
            <div className="kpi-icon-wrapper orange">
              <FaUsers />
            </div>
            <div className="kpi-text">
              <span className="kpi-label">Registered Citizens</span>
              <h2 className="kpi-value">{stats.totalUsers}</h2>
              <span className="kpi-subtext">Verified accounts</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/admin/categories')}>
            <div className="kpi-icon-wrapper green">
              <FaFolder />
            </div>
            <div className="kpi-text">
              <span className="kpi-label">Sectors & Categories</span>
              <h2 className="kpi-value">{stats.totalCategories}</h2>
              <span className="kpi-subtext">National domains</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrapper purple">
              <FaBookmark />
            </div>
            <div className="kpi-text">
              <span className="kpi-label">Citizen Bookmarks</span>
              <h2 className="kpi-value">{stats.totalBookmarks}</h2>
              <span className="kpi-subtext">Saved across user profiles</span>
            </div>
          </div>
        </div>

        {/* Analytics & Charts Section */}
        <div className="dashboard-charts-grid">
          {/* Category Scheme Volume Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-header-left">
                <FaChartBar className="chart-icon" />
                <div>
                  <h3>Schemes by National Sector</h3>
                  <span>Distribution across top government welfare categories</span>
                </div>
              </div>
              <Link to="/admin/categories" className="chart-link-btn">View All</Link>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    interval={0} 
                    angle={-25} 
                    textAnchor="end" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Bookmarked Schemes Card */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-header-left">
                <FaBookmark className="chart-icon text-orange" />
                <div>
                  <h3>Most Bookmarked Schemes</h3>
                  <span>Schemes with highest citizen interest</span>
                </div>
              </div>
            </div>
            <div className="ranking-list-body">
              {stats.mostBookmarked && stats.mostBookmarked.length > 0 ? (
                stats.mostBookmarked.map((item, idx) => (
                  <div key={idx} className="ranking-item">
                    <span className="ranking-number">{idx + 1}</span>
                    <div className="ranking-info">
                      <strong className="ranking-title">{item.name}</strong>
                      <span className="ranking-sub">{item.category || item.schemeId}</span>
                    </div>
                    <div className="ranking-metric">
                      <FaBookmark className="icon-tiny" /> {item.count} saves
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-subtext">No bookmark data accumulated yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Split: Recent Schemes & Recent Admin Audit Logs */}
        <div className="dashboard-bottom-grid">
          {/* Recent Schemes Table */}
          <div className="table-preview-card">
            <div className="card-top-bar">
              <div className="card-top-title">
                <FaFileAlt className="card-icon" />
                <h3>Recent Scheme Entries</h3>
              </div>
              <Link to="/admin/manage-schemes" className="card-see-all">
                Manage All <FaArrowRight />
              </Link>
            </div>
            <div className="mini-table-wrapper">
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Scheme Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSchemes && stats.recentSchemes.length > 0 ? (
                    stats.recentSchemes.map(s => (
                      <tr key={s.id}>
                        <td className="mini-title-cell">
                          <strong>{s.name}</strong>
                          <span className="mini-id">{s.id}</span>
                        </td>
                        <td>
                          <span className="mini-cat-badge">{s.category}</span>
                        </td>
                        <td>
                          <span className={`mini-status-pill ${s.status === 'Active' ? 'active' : 'inactive'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/edit-scheme/${s.id}`} className="mini-edit-btn">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-cell">No recent schemes found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Activity Feed */}
          <div className="table-preview-card">
            <div className="card-top-bar">
              <div className="card-top-title">
                <FaHistory className="card-icon" />
                <h3>Recent Activity & Audit Trail</h3>
              </div>
            </div>
            <div className="audit-timeline">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((log, idx) => (
                  <div key={log.id || idx} className="audit-event">
                    <div className="audit-bullet"></div>
                    <div className="audit-details">
                      <p className="audit-message">{log.message}</p>
                      <span className="audit-time">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-subtext">No activity logged yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

