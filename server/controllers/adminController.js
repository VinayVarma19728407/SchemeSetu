import AdminService from '../services/AdminService.js';
import SchemeService from '../services/SchemeService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

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
  getDashboardStats,
  createScheme,
  updateScheme,
  deleteScheme,
  uploadLogo
};
