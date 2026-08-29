import { errorResponse } from '../utils/responseFormatter.js';

/**
 * Creates an Express middleware that validates req.body, req.query, or req.params.
 * @param {Function} validatorFn - The validator function from the validators folder.
 */
export const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    next();
  };
};

export default validate;
