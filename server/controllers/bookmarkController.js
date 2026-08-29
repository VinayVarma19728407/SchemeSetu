import BookmarkService from '../services/BookmarkService.js';
import AnalyticsService from '../services/AnalyticsService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Lists all bookmarks of the authenticated user.
 */
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = BookmarkService.getBookmarks(req.user.id);
    return successResponse(res, bookmarks, 'Bookmarks retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Adds a scheme to user bookmarks.
 */
export const addBookmark = async (req, res, next) => {
  const { schemeId } = req.body;
  if (!schemeId) {
    return errorResponse(res, 'Scheme ID is required', 400);
  }
  
  try {
    const list = BookmarkService.addBookmark(req.user.id, schemeId);
    AnalyticsService.logBookmarkEvent(schemeId, 1);
    return successResponse(res, list, 'Bookmark added successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Removes a scheme from user bookmarks.
 */
export const removeBookmark = async (req, res, next) => {
  const { schemeId } = req.params;
  if (!schemeId) {
    return errorResponse(res, 'Scheme ID is required', 400);
  }
  
  try {
    const list = BookmarkService.removeBookmark(req.user.id, schemeId);
    AnalyticsService.logBookmarkEvent(schemeId, -1);
    return successResponse(res, list, 'Bookmark removed successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export default {
  getBookmarks,
  addBookmark,
  removeBookmark
};
