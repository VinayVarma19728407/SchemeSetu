/**
 * Validates eligibility check request payloads.
 */
export const validateEligibilityCheck = (req) => {
  const { schemeId, answers } = req.body;
  const errors = [];
  
  if (!schemeId || typeof schemeId !== 'string' || schemeId.trim() === '') {
    errors.push('Scheme ID is required.');
  }
  
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    errors.push('Answers must be a JSON object containing key-value pairs.');
  }
  
  return errors;
};

export default {
  validateEligibilityCheck
};
