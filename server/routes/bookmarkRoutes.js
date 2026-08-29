import express from 'express';
import { getBookmarks, addBookmark, removeBookmark } from '../controllers/bookmarkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All bookmark routes are protected
router.use(protect);

router.get('/', getBookmarks);
router.post('/', addBookmark);
router.delete('/:schemeId', removeBookmark);

export default router;
