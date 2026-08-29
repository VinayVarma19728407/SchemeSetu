import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Authentication middleware.
 * Verifies JWT token and attaches user payload to req.user.
 */
export const protect = (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return errorResponse(res, 'Not authorized, token missing', 401);
  }
  
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(res, 'Not authorized, invalid token', 401);
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, token failed', 401);
  }
};

export default protect;
