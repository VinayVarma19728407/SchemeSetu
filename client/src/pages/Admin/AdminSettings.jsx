import React, { useState, useContext } from 'react';
import { 
  FaShieldAlt, 
  FaKey, 
  FaServer, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaLock
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import adminService from '../../services/adminService.js';
import './AdminSubViews.css';

export const AdminSettings = () => {
  const { user } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setSaving(true);
      const res = await adminService.updateSettings(currentPassword, newPassword);
      if (res.success) {
        setSuccess('Administrator password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.message || 'Failed to update password');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout 
      title="Admin Settings & Security" 
      subtitle="Manage credentials, platform security, and view datastore status"
    >
      <div className="admin-subview-container">
        {error && (
          <div className="admin-alert error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {success && (
          <div className="admin-alert success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '6px' }}>
            <FaCheckCircle /> {success}
          </div>
        )}

        <div className="admin-settings-grid">
          {/* Security & Password Card */}
          <div className="settings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <FaLock style={{ color: '#0284c7' }} />
              <h3 style={{ margin: 0 }}>Security & Credentials</h3>
            </div>
            <p className="subtitle">
              Change administrator password for account <strong>{user?.email || 'admin@schemesetu.gov'}</strong>.
            </p>

            <form onSubmit={handlePasswordUpdate}>
              <div className="settings-form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="settings-form-group">
                <label>New Password (min 8 characters)</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="settings-form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-save-settings"
                disabled={saving}
              >
                <FaKey /> {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* System & Architecture Info Card */}
          <div className="settings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <FaServer style={{ color: '#16a34a' }} />
              <h3 style={{ margin: 0 }}>System Environment</h3>
            </div>
            <p className="subtitle">Runtime platform parameters and storage architecture.</p>

            <ul className="system-info-list">
              <li>
                <span className="system-info-label">Application Version</span>
                <span className="system-info-val">SchemeSetu v1.0</span>
              </li>
              <li>
                <span className="system-info-label">Primary Role</span>
                <span className="system-info-val">Central Administrator</span>
              </li>
              <li>
                <span className="system-info-label">Datastore Engine</span>
                <span className="system-info-val">Portable JSON Flat-Files</span>
              </li>
              <li>
                <span className="system-info-label">Data Directory</span>
                <span className="system-info-val"><code>server/data/</code></span>
              </li>
              <li>
                <span className="system-info-label">Uploads Directory</span>
                <span className="system-info-val"><code>server/uploads/</code></span>
              </li>
              <li>
                <span className="system-info-label">Session Authentication</span>
                <span className="system-info-val">JWT (HS256)</span>
              </li>
              <li>
                <span className="system-info-label">Eligibility Matcher</span>
                <span className="system-info-val">Real-time Rule Engine</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
