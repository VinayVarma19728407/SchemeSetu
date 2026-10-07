import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  // Authentication
  login: async (email, password) => {
    const res = await axios.post('/api/admin/login', { email, password });
    return res.data;
  },

  // Dashboard & Metrics
  getDashboardStats: async () => {
    const res = await axios.get('/api/admin/dashboard', { headers: getAuthHeaders() });
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await axios.get('/api/admin/logs', { headers: getAuthHeaders() });
    return res.data;
  },

  // Scheme CRUD
  getSchemes: async (params = {}) => {
    const res = await axios.get('/api/admin/schemes', {
      headers: getAuthHeaders(),
      params
    });
    return res.data;
  },

  getSchemeById: async (id) => {
    const res = await axios.get(`/api/admin/scheme/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  createScheme: async (schemeData) => {
    const res = await axios.post('/api/admin/scheme', schemeData, { headers: getAuthHeaders() });
    return res.data;
  },

  updateScheme: async (id, schemeData) => {
    const res = await axios.put(`/api/admin/scheme/${id}`, schemeData, { headers: getAuthHeaders() });
    return res.data;
  },

  toggleStatus: async (id) => {
    const res = await axios.patch(`/api/admin/scheme/${id}/status`, {}, { headers: getAuthHeaders() });
    return res.data;
  },

  deleteScheme: async (id) => {
    const res = await axios.delete(`/api/admin/scheme/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const res = await axios.post('/api/admin/upload', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  // Categories & Users
  getCategories: async () => {
    const res = await axios.get('/api/admin/categories', { headers: getAuthHeaders() });
    return res.data;
  },

  getUsers: async () => {
    const res = await axios.get('/api/admin/users', { headers: getAuthHeaders() });
    return res.data;
  },

  // Settings
  updateSettings: async (currentPassword, newPassword) => {
    const res = await axios.put('/api/admin/settings', { currentPassword, newPassword }, { headers: getAuthHeaders() });
    return res.data;
  }
};

export default adminService;
