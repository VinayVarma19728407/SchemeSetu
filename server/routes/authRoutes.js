import express from 'express';
import { signup, login, logout, getProfile, updateProfile } from '../controllers/authController.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { validateSignup, validateLogin } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply auth rate limiting to signup and login
router.post('/signup', authLimiter, validate(validateSignup), signup);
router.post('/login', authLimiter, validate(validateLogin), login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
