import express from 'express';
import { checkEligibility, findMatchingSchemes, getQuestionnaire } from '../controllers/eligibilityController.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { validateEligibilityCheck } from '../validators/eligibilityValidator.js';

const router = express.Router();

router.post('/check', validate(validateEligibilityCheck), checkEligibility);
router.post('/match', findMatchingSchemes);
router.get('/questionnaire/:slug', getQuestionnaire);

export default router;
