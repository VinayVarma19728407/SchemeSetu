import { errorResponse } from '../utils/responseFormatter.js';
import { logEvent } from './loggerMiddleware.js';
import config from '../config/config.js';

/**
 * Centralized error handler middleware.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  logEvent('error', message, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
    ip: req.ip
  });
  
  // Respond to client
  // Exclude stack trace from client, even in development to keep simple responses
  return errorResponse(res, message, statusCode, err.errors || null);
};

export default errorHandler;
