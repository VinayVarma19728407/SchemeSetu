import AuthService from '../services/AuthService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Handle user registration.
 */
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const result = await AuthService.signup(name, email, password);
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Handle user/admin login.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await AuthService.login(email, password);
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

/**
 * Handle logout.
 */
export const logout = async (req, res, next) => {
  // Since we use stateless JWT, clients simply delete the token.
  // We can return a success message.
  return successResponse(res, null, 'Logged out successfully');
};

/**
 * Handle profile retrieval.
 */
export const getProfile = async (req, res, next) => {
  try {
    const profile = AuthService.getProfile(req.user.id);
    return successResponse(res, profile, 'Profile retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Handle profile update.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const profile = AuthService.updateProfile(req.user.id, req.body);
    return successResponse(res, profile, 'Profile updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export default {
  signup,
  login,
  logout,
  getProfile,
  updateProfile
};
