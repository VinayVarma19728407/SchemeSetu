import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Limit auth attempts to prevent brute force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Too many login or registration attempts. Please try again after 15 minutes.', 429);
  }
});

/**
 * General api rate limiter.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 API requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Too many requests. Please try again later.', 429);
  }
});

export default {
  authLimiter,
  apiLimiter
};
