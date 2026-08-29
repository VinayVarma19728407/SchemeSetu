/**
 * Validates a scheme payload.
 */
export const validateSchemePayload = (req) => {
  const {
    id, slug, name, category, ministry, status, overview,
    objectives, benefits, eligibility, requiredDocuments,
    applicationProcess, faqs, officialInfoLink, officialApplyLink,
    keywords, tags, featured, recentlyAdded
  } = req.body;
  
  const errors = [];
  
  // Required string fields
  if (!id || typeof id !== 'string' || id.trim() === '') errors.push('ID is required and must be a string.');
  if (!slug || typeof slug !== 'string' || slug.trim() === '') errors.push('Slug is required and must be a string.');
  if (!name || typeof name !== 'string' || name.trim() === '') errors.push('Scheme Name is required and must be a string.');
  if (!category || typeof category !== 'string' || category.trim() === '') errors.push('Category is required and must be a string.');
  
  if (!ministry) {
    errors.push('Ministry is required.');
  } else if (typeof ministry === 'object') {
    if (!ministry.name || ministry.name.trim() === '') errors.push('Ministry name is required.');
  } else if (typeof ministry !== 'string') {
    errors.push('Ministry must be a string or an object.');
  }
  
  if (!status || typeof status !== 'string' || status.trim() === '') errors.push('Status is required.');
  if (!overview || typeof overview !== 'string' || overview.trim() === '') errors.push('Overview is required.');
  
  // Required arrays
  if (!Array.isArray(objectives)) errors.push('Objectives must be an array.');
  if (!Array.isArray(benefits)) errors.push('Benefits must be an array.');
  if (!Array.isArray(requiredDocuments)) errors.push('Required Documents must be an array.');
  if (!Array.isArray(applicationProcess)) errors.push('Application Process must be an array.');
  if (!Array.isArray(faqs)) errors.push('FAQs must be an array.');
  if (!Array.isArray(keywords)) errors.push('Keywords must be an array.');
  if (!Array.isArray(tags)) errors.push('Tags must be an array.');
  
  // Eligibility object
  if (!eligibility || typeof eligibility !== 'object') {
    errors.push('Eligibility configuration object is required.');
  }
  
  // Links
  if (!officialInfoLink || typeof officialInfoLink !== 'string' || officialInfoLink.trim() === '') {
    errors.push('Official Information Link is required.');
  }
  if (!officialApplyLink || typeof officialApplyLink !== 'string' || officialApplyLink.trim() === '') {
    errors.push('Official Application Link is required.');
  }
  
  return errors;
};

export default {
  validateSchemePayload
};
