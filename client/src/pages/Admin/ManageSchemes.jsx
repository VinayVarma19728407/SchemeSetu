import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaToggleOn, 
  FaToggleOff, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaRedo
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SchemePreviewModal from '../../components/admin/SchemePreviewModal.jsx';
import adminService from '../../services/adminService.js';
import './ManageSchemes.css';

const CATEGORIES = [
  'All',
  'Agriculture',
  'Education',
  'Employment',
  'Financial Assistance',
  'Food & Public Distribution',
  'Green India & Environment',
  'Health',
  'Housing',
  'Infrastructure',
  'Insurance',
  'MSME',
  'Pension',
  'Senior Citizens',
  'Skill Development',
  'Startups & Entrepreneurship',
  'Students',
  'Women & Child Development'
];

export const ManageSchemes = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [schemes, setSchemes] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20
  });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Preview Modal State
  const [previewScheme, setPreviewScheme] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSchemes = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getSchemes({
        page,
        limit: 20,
        search: search.trim(),
        category: category !== 'All' ? category : '',
        status: status !== 'All' ? status : '',
        sort: 'recent'
      });

      if (res.success && res.data) {
        setSchemes(res.data.schemes || []);
        setPagination(res.data.pagination || {
          totalRecords: 0,
          totalPages: 1,
          currentPage: page,
          limit: 20
        });
      } else {
        setError('Failed to load schemes list.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching schemes from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(1);
  }, [category, status]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchSchemes(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
  };

  const handleToggleStatus = async (scheme) => {
    try {
      const res = await adminService.toggleStatus(scheme.id);
      if (res.success) {
        const newStatus = res.data.status;
        setSchemes(prev => prev.map(s => s.id === scheme.id ? { ...s, status: newStatus } : s));
        showToast(`Status of ${scheme.name} changed to ${newStatus}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle scheme status');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await adminService.deleteScheme(deleteTarget.id);
      if (res.success) {
        showToast(`Scheme "${deleteTarget.name}" deleted successfully.`);
        setSchemes(prev => prev.filter(s => s.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete scheme.');
    } finally {
      setDeleting(false);
    }
  };

  const openPreview = (scheme) => {
    setPreviewScheme(scheme);
    setPreviewModalOpen(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <AdminLayout 
      title="Manage Government Schemes" 
      subtitle={`Repository overview: ${pagination.totalRecords} registered schemes`}
    >
      <div className="manage-schemes-container">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="manage-schemes-toast">
            <FaCheckCircle /> <span>{toastMessage}</span>
          </div>
        )}

        {/* Action & Filter Toolbar */}
        <div className="manage-toolbar-card">
          <div className="toolbar-top-row">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search schemes by name, keyword, ID, or ministry..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn-search-submit">Search</button>
            </form>

            <button 
              className="btn-add-scheme-main" 
              onClick={() => navigate('/admin/add-scheme')}
            >
              <FaPlus /> Add New Scheme
            </button>
          </div>

          <div className="toolbar-filters-row">
            <div className="filter-item">
              <label>Category:</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-item">
              <label>Status:</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>

            {(search || category !== 'All' || status !== 'All') && (
              <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                <FaRedo /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Content Table / Loading / Error */}
        {loading ? (
          <div className="schemes-loading-state">
            <div className="spinner"></div>
            <p>Loading schemes catalog...</p>
          </div>
        ) : error ? (
          <div className="schemes-error-state">
            <FaExclamationTriangle />
            <p>{error}</p>
            <button onClick={() => fetchSchemes(pagination.currentPage)}>Retry</button>
          </div>
        ) : schemes.length === 0 ? (
          <div className="schemes-empty-state">
            <p>No schemes matched your search/filter criteria.</p>
            <button className="btn-reset-filters" onClick={handleResetFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="table-responsive-card">
            <table className="admin-schemes-table">
              <thead>
                <tr>
                  <th>Scheme</th>
                  <th>Category</th>
                  <th>Ministry</th>
                  <th>Status</th>
                  <th>Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map(scheme => {
                  const ministryName = typeof scheme.ministry === 'object' ? scheme.ministry?.name : scheme.ministry;
                  const isAct = scheme.status === 'Active';

                  return (
                    <tr key={scheme.id}>
                      <td className="scheme-title-col">
                        <div className="scheme-title-box">
                          {scheme.logo ? (
                            <img 
                              src={scheme.logo} 
                              alt="logo" 
                              className="scheme-row-logo"
                              onError={(e) => { e.target.style.display = 'none'; }} 
                            />
                          ) : (
                            <div className="scheme-row-badge-icon">
                              {scheme.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="scheme-row-name">{scheme.name}</span>
                            <div className="scheme-row-meta">
                              <code>{scheme.id}</code>
                              {scheme.analytics?.featured && <span className="pill-featured">Featured</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill-category">{scheme.category}</span>
                      </td>
                      <td className="scheme-ministry-col">
                        <span title={ministryName}>{ministryName || 'Not specified'}</span>
                      </td>
                      <td>
                        <button 
                          className={`btn-status-toggle ${isAct ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(scheme)}
                          title="Click to toggle status"
                        >
                          {isAct ? <><FaToggleOn /> Active</> : <><FaToggleOff /> Inactive</>}
                        </button>
                      </td>
                      <td>
                        <span className="version-tag">v{scheme.metadata?.version || '1.0'}</span>
                      </td>
                      <td>
                        <div className="actions-cluster">
                          <button 
                            className="btn-action-icon preview" 
                            title="Preview Citizen View"
                            onClick={() => openPreview(scheme)}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-action-icon edit" 
                            title="Edit Scheme"
                            onClick={() => navigate(`/admin/edit-scheme/${scheme.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-action-icon delete" 
                            title="Delete Scheme"
                            onClick={() => setDeleteTarget(scheme)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="admin-pagination-bar">
                <span className="pagination-count-label">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)} of {pagination.totalRecords} schemes
                </span>
                <div className="pagination-buttons">
                  <button 
                    disabled={!pagination.hasPrev}
                    onClick={() => fetchSchemes(pagination.currentPage - 1)}
                    className="btn-page-nav"
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  <span className="page-indicator">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button 
                    disabled={!pagination.hasNext}
                    onClick={() => fetchSchemes(pagination.currentPage + 1)}
                    className="btn-page-nav"
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="admin-modal-backdrop" onClick={() => setDeleteTarget(null)}>
            <div className="delete-confirm-box" onClick={e => e.stopPropagation()}>
              <div className="delete-confirm-icon">
                <FaExclamationTriangle />
              </div>
              <h3>Confirm Scheme Deletion</h3>
              <p>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong> (ID: {deleteTarget.id})?
                This action is permanent and will remove the scheme from the repository.
              </p>
              <div className="delete-confirm-actions">
                <button 
                  className="btn-cancel" 
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button 
                  className="btn-confirm-delete" 
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Scheme'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scheme Preview Modal */}
        <SchemePreviewModal 
          scheme={previewScheme}
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewScheme(null);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default ManageSchemes;

