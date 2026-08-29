import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getDashboardStats, createScheme, updateScheme, deleteScheme, uploadLogo } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { validateSchemePayload } from '../validators/schemeValidator.js';
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
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed.'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.post('/scheme', validate(validateSchemePayload), createScheme);
router.put('/scheme/:id', validate(validateSchemePayload), updateScheme);
router.delete('/scheme/:id', deleteScheme);

// Logo Upload Route
router.post('/upload', upload.single('logo'), uploadLogo);

export default router;
