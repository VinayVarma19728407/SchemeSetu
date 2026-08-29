import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Admin authorization middleware.
 * Restricts access to administrators only.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Administrator') {
    next();
  } else {
    return errorResponse(res, 'Access denied, administrator only', 403);
  }
};

export default adminOnly;
