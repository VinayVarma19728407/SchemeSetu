import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFolder, 
  FaSearch, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaLayerGroup, 
  FaArrowRight, 
  FaSync 
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import adminService from '../../services/adminService.js';
import './AdminSubViews.css';

export const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getCategories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setError('Unexpected response format from categories API');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSchemes = categories.reduce((acc, c) => acc + (c.totalSchemes || 0), 0);
  const activeSchemes = categories.reduce((acc, c) => acc + (c.activeSchemes || 0), 0);
  const inactiveSchemes = categories.reduce((acc, c) => acc + (c.inactiveSchemes || 0), 0);

  return (
    <AdminLayout 
      title="Scheme Categories" 
      subtitle="Comprehensive breakdown of welfare schemes by government sector"
    >
      <div className="admin-subview-container">
        {/* Top Summary Stats */}
        <div className="admin-subview-stats">
          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon blue">
              <FaLayerGroup />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{categories.length}</h3>
              <p>Total Categories</p>
            </div>
          </div>

          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon">
              <FaCheckCircle />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{activeSchemes}</h3>
              <p>Active Schemes</p>
            </div>
          </div>

          <div className="admin-subview-stat-card">
            <div className="admin-subview-stat-icon amber">
              <FaTimesCircle />
            </div>
            <div className="admin-subview-stat-info">
              <h3>{inactiveSchemes}</h3>
              <p>Inactive / Draft</p>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="admin-subview-header-row">
          <div className="admin-subview-search">
            <FaSearch className="admin-subview-search-icon" />
            <input 
              type="text" 
              placeholder="Filter categories..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button 
            type="button" 
            className="btn-view-schemes" 
            onClick={fetchCategories}
            disabled={loading}
          >
            <FaSync className={loading ? 'fa-spin' : ''} /> Refresh
          </button>
        </div>

        {error && <div className="admin-alert error">{error}</div>}

        {/* Categories Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No categories matching "{search}"
          </div>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map(cat => (
              <div key={cat.id || cat.name} className="category-card">
                <div className="category-card-top">
                  <span className="category-card-icon">{cat.icon || '??'}</span>
                  <div>
                    <h4 className="category-card-title">{cat.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {cat.totalSchemes} total schemes
                    </span>
                  </div>
                </div>

                <div className="category-card-counts">
                  <span className="badge-active-count">
                    {cat.activeSchemes} Active
                  </span>
                  <span className="badge-inactive-count">
                    {cat.inactiveSchemes} Inactive
                  </span>
                </div>

                <div className="category-card-action">
                  <Link 
                    to={`/admin/manage-schemes?category=${encodeURIComponent(cat.name)}`}
                    className="btn-view-schemes"
                  >
                    View Schemes <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoriesView;
