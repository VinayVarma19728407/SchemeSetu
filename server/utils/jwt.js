import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Generates a JWT token for the user.
 */
export const generateToken = (userId, role = 'User') => {
  return jwt.sign(
    { id: userId, role },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

/**
 * Verifies a JWT token.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

export default {
  generateToken,
  verifyToken
};
