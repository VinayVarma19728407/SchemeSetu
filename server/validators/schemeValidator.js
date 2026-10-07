/**
 * Validates a scheme payload.
 */
export const validateSchemePayload = (req) => {
  const {
    id, slug, name, category, ministry, status, overview,
    objectives, benefits, eligibility, requiredDocuments,
    applicationProcess, faqs, officialInfoLink, officialApplyLink, officialLinks,
    keywords, tags
  } = req.body;
  
  const errors = [];
  
  // Required string fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Scheme Name is required and must be a string.');
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required and must be a string.');
  }
  
  // ID is optional on create (auto-assigned if missing), but if provided must be valid string
  if (id !== undefined && (typeof id !== 'string' || id.trim() === '')) {
    errors.push('ID must be a non-empty string.');
  }
  
  // Slug is optional (auto-generated from name if missing)
  if (slug !== undefined && (typeof slug !== 'string' || slug.trim() === '')) {
    errors.push('Slug must be a non-empty string.');
  }
  
  if (!ministry) {
    errors.push('Ministry is required.');
  } else if (typeof ministry === 'object') {
    if (!ministry.name || ministry.name.trim() === '') errors.push('Ministry name is required.');
  } else if (typeof ministry !== 'string') {
    errors.push('Ministry must be a string or an object.');
  }
  
  if (!overview || typeof overview !== 'string' || overview.trim() === '') {
    errors.push('Overview is required.');
  }
  
  // Arrays should be arrays if present
  if (objectives !== undefined && !Array.isArray(objectives)) errors.push('Objectives must be an array.');
  if (benefits !== undefined && !Array.isArray(benefits)) errors.push('Benefits must be an array.');
  if (requiredDocuments !== undefined && !Array.isArray(requiredDocuments)) errors.push('Required Documents must be an array.');
  if (applicationProcess !== undefined && !Array.isArray(applicationProcess)) errors.push('Application Process must be an array.');
  if (faqs !== undefined && !Array.isArray(faqs)) errors.push('FAQs must be an array.');
  if (keywords !== undefined && !Array.isArray(keywords)) errors.push('Keywords must be an array.');
  if (tags !== undefined && !Array.isArray(tags)) errors.push('Tags must be an array.');
  
  // Eligibility object
  if (eligibility !== undefined) {
    if (typeof eligibility !== 'object' || eligibility === null) {
      errors.push('Eligibility must be a valid configuration object.');
    } else if (eligibility.customQuestions !== undefined) {
      if (!Array.isArray(eligibility.customQuestions)) {
        errors.push('Custom questions must be an array.');
      } else {
        eligibility.customQuestions.forEach((q, idx) => {
          if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
            errors.push(`Custom Question #${idx + 1} must have a valid question prompt.`);
          }
          if (q.expectedAnswer === undefined || q.expectedAnswer === null || String(q.expectedAnswer).trim() === '') {
            errors.push(`Custom Question #${idx + 1} must specify an expected answer for eligibility.`);
          }
        });
      }
    }
  }
  
  // Links - accept either top-level links or nested officialLinks object
  const infoLink = officialInfoLink || officialLinks?.information;
  const applyLink = officialApplyLink || officialLinks?.application;
  
  if (!infoLink || typeof infoLink !== 'string' || infoLink.trim() === '') {
    errors.push('Official Information Link is required.');
  }
  if (!applyLink || typeof applyLink !== 'string' || applyLink.trim() === '') {
    errors.push('Official Application Link is required.');
  }
  
  return errors;
};

export default {
  validateSchemePayload
};
