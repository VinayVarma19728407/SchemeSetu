import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  loginAdmin,
  getDashboardStats, 
  getAdminSchemes,
  getSchemeById,
  createScheme, 
  updateScheme, 
  toggleSchemeStatus,
  deleteScheme, 
  getCategories,
  getUsers,
  getAuditLogs,
  updateSettings,
  uploadLogo 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { validateSchemePayload } from '../validators/schemeValidator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import config from '../config/config.js';

const router = express.Router();

// Ensure upload directory exists
if (!fs.existsSync(config.uploadsDir)) {
  fs.mkdirSync(config.uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `logo-${Date.now()}${ext}`);
  }
});

// Multer File Upload Filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'image/svg+xml';
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif, svg, webp) are allowed.'));
    }
  },
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB
});

// Public Admin Route: Direct Admin Login
router.post('/login', authLimiter, loginAdmin);

// Protected Admin Routes (Requires valid JWT with role === 'Administrator')
router.use(protect);
router.use(adminOnly);

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/logs', getAuditLogs);

// Scheme Management CRUD
router.get('/schemes', getAdminSchemes);
router.get('/scheme/:id', getSchemeById);
router.post('/scheme', validate(validateSchemePayload), createScheme);
router.put('/scheme/:id', validate(validateSchemePayload), updateScheme);
router.patch('/scheme/:id/status', toggleSchemeStatus);
router.delete('/scheme/:id', deleteScheme);

// Categories & Users Overview
router.get('/categories', getCategories);
router.get('/users', getUsers);

// Admin Settings (Password update)
router.put('/settings', updateSettings);

// Logo Upload Route
router.post('/upload', upload.single('logo'), uploadLogo);

export default router;
