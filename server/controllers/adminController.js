import AdminService from '../services/AdminService.js';
import SchemeService from '../services/SchemeService.js';
import AuthService from '../services/AuthService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Handles admin direct login.
 */
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }
    const result = await AuthService.login(email, password);
    if (result.user.role !== 'Administrator') {
      return errorResponse(res, 'Access denied. Administrator privileges required.', 403);
    }
    return successResponse(res, result, 'Administrator logged in successfully');
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

/**
 * Gets admin dashboard statistics.
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = AdminService.getDashboardStats();
    return successResponse(res, stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets all schemes for admin with pagination, filtering, and search.
 */
export const getAdminSchemes = async (req, res, next) => {
  try {
    const result = AdminService.getAdminSchemes(req.query);
    return successResponse(res, result, 'Schemes retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets a single scheme by ID for editing or inspection.
 */
export const getSchemeById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const scheme = AdminService.getSchemeById(id);
    return successResponse(res, scheme, 'Scheme details retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

/**
 * Creates a new scheme.
 */
export const createScheme = async (req, res, next) => {
  try {
    const newScheme = SchemeService.createScheme(req.body);
    return successResponse(res, newScheme, 'Scheme created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Updates an existing scheme.
 */
export const updateScheme = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedScheme = SchemeService.updateScheme(id, req.body);
    return successResponse(res, updatedScheme, 'Scheme updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Toggles a scheme's active / inactive status.
 */
export const toggleSchemeStatus = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedScheme = AdminService.toggleSchemeStatus(id);
    return successResponse(res, updatedScheme, `Scheme status set to ${updatedScheme.status}`);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Deletes an existing scheme.
 */
export const deleteScheme = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedScheme = SchemeService.deleteScheme(id);
    return successResponse(res, deletedScheme, 'Scheme deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Gets category overview and scheme counts.
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = AdminService.getCategoriesBreakdown();
    return successResponse(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets registered users list with bookmark metrics.
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = AdminService.getUsersList();
    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets system audit logs.
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = AdminService.getAuditLogs();
    return successResponse(res, logs, 'Audit logs retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Updates administrator settings (password).
 */
export const updateSettings = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const adminId = req.user?.id || 'ADM001';
    const result = await AdminService.updateAdminPassword(adminId, currentPassword, newPassword);
    return successResponse(res, result, 'Settings updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Handles logo upload.
 */
export const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }
    
    // Relative path for client usage
    const filePath = `/uploads/${req.file.filename}`;
    return successResponse(res, { filePath }, 'Logo uploaded successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export default {
  loginAdmin,
  getDashboardStats,
  getAdminSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  toggleSchemeStatus,
  deleteScheme,
  getCategories,
  getUsers,
  getAuditLogs,
  updateSettings,
  uploadLogo
};
