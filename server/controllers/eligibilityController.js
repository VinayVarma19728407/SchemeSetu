import EligibilityService from '../services/EligibilityService.js';
import SchemeService from '../services/SchemeService.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Checks user answers against a single scheme.
 */
export const checkEligibility = async (req, res, next) => {
  const { schemeId, answers } = req.body;
  
  try {
    const allSchemes = SchemeService.getAllSchemes(true);
    const scheme = allSchemes.find(s => s.id === schemeId);
    if (!scheme) {
      return errorResponse(res, 'Scheme not found', 404);
    }
    
    const result = EligibilityService.checkSchemeEligibility(scheme, answers);
    return successResponse(res, result, 'Eligibility evaluation complete');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Matches user profile details across all active schemes.
 */
export const findMatchingSchemes = async (req, res, next) => {
  try {
    const result = EligibilityService.findMatchingSchemes(req.body);
    return successResponse(res, result, 'Profile matching complete');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Gets a dynamically generated questionnaire for a specific scheme.
 */
export const getQuestionnaire = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const scheme = SchemeService.getSchemeBySlug(slug);
    if (!scheme) {
      return errorResponse(res, 'Scheme not found', 404);
    }
    
    const questions = EligibilityService.generateSchemeQuestionnaire(scheme);
    return successResponse(res, questions, 'Questionnaire generated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export default {
  checkEligibility,
  findMatchingSchemes,
  getQuestionnaire
};
