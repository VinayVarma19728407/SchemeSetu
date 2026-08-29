/**
 * Format success response payload.
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Format error response payload.
 */
export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
    data: null
  };
  
  if (errors) {
    payload.errors = errors;
  }
  
  return res.status(statusCode).json(payload);
};

export default {
  success: successResponse,
  error: errorResponse
};
