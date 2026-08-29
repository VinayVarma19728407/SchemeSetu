import SchemeService from '../services/SchemeService.js';
import AnalyticsService from '../services/AnalyticsService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { readJson } from '../utils/fileManager.js';
import path from 'path';
import config from '../config/config.js';

/**
 * Lists all active schemes (with pagination, search, filters).
 */
export const getSchemes = async (req, res, next) => {
  try {
    const result = SchemeService.getSchemes(req.query);
    
    // Log search query for analytics
    if (req.query.search && req.query.search.trim() !== '') {
      AnalyticsService.logSearch(req.query.search, result.pagination.totalRecords);
    }
    
    return successResponse(res, result, 'Schemes retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets a single scheme by its slug.
 */
export const getSchemeBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const scheme = SchemeService.getSchemeBySlug(slug);
    if (!scheme) {
      return errorResponse(res, 'Scheme not found', 404);
    }
    
    // Log view analytics
    AnalyticsService.logView(scheme.id);
    
    return successResponse(res, scheme, 'Scheme retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets featured schemes.
 */
export const getFeaturedSchemes = async (req, res, next) => {
  try {
    const featured = SchemeService.getFeaturedSchemes();
    return successResponse(res, featured, 'Featured schemes retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets recently added schemes.
 */
export const getRecentSchemes = async (req, res, next) => {
  try {
    const recent = SchemeService.getRecentSchemes();
    return successResponse(res, recent, 'Recent schemes retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets all category names and icons.
 */
export const getCategories = async (req, res, next) => {
  try {
    const categoriesFile = path.join(config.dataDir, 'metadata', 'categories.json');
    const categories = readJson(categoriesFile, []);
    return successResponse(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export default {
  getSchemes,
  getSchemeBySlug,
  getFeaturedSchemes,
  getRecentSchemes,
  getCategories
};
