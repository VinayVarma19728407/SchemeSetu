import express from 'express';
import { getSchemes, getSchemeBySlug, getFeaturedSchemes, getRecentSchemes, getCategories } from '../controllers/schemeController.js';

const router = express.Router();

router.get('/', getSchemes);
router.get('/featured', getFeaturedSchemes);
router.get('/recent', getRecentSchemes);
router.get('/categories', getCategories);
router.get('/:slug', getSchemeBySlug);

export default router;
