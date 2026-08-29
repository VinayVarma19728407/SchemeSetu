import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageSchemes.css';
import { AuthContext } from '../../context/AuthContext.jsx';

const ManageSchemes = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchemes = async () => {
    try {
      const { data } = await axios.get('/api/admin/schemes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchemes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scheme?')) return;
    try {
      await axios.delete(`/api/admin/schemes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchemes(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (id) => {
    // Placeholder: navigate to an edit page (not implemented yet)
    navigate(`/admin/edit-scheme/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/add-scheme');
  };

  if (loading) return <div className="manage-schemes-loading">Loading schemes…</div>;
  if (error) return <div className="manage-schemes-error">{error}</div>;

  return (
    <div className="manage-schemes-wrapper">
      <h1 className="manage-schemes-title">Manage Schemes</h1>
      <button className="manage-schemes-add-btn" onClick={handleAddNew}>Add New Scheme</button>
      {schemes.length === 0 ? (
        <p className="manage-schemes-empty">No schemes available.</p>
      ) : (
        <table className="manage-schemes-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Ministry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((scheme) => (
              <tr key={scheme.id}>
                <td>{scheme.name}</td>
                <td>{scheme.category}</td>
                <td>{scheme.ministry?.name || scheme.ministry}</td>
                <td>
                  <button className="manage-schemes-edit" onClick={() => handleEdit(scheme.id)}>Edit</button>
                  <button className="manage-schemes-delete" onClick={() => handleDelete(scheme.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSchemes;
