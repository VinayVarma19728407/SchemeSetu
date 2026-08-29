import { getAllSchemes } from './SchemeService.js';
import { logEvent } from '../middleware/loggerMiddleware.js';

/**
 * Checks eligibility of a user's answers against a scheme's criteria.
 * Returns { eligible: boolean, status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible', failedConditions: [], passedConditions: [] }
 */
export const checkSchemeEligibility = (scheme, answers) => {
  const failedConditions = [];
  const passedConditions = [];
  const el = scheme.eligibility;
  
  if (!el) {
    return {
      eligible: true,
      status: 'Eligible',
      failedConditions: [],
      passedConditions: ['No eligibility criteria defined.']
    };
  }
  
  // 1. Age Check
  if (el.age) {
    const { minimum, maximum } = el.age;
    if (answers.age !== undefined && answers.age !== null) {
      const userAge = parseInt(answers.age);
      if (minimum !== null && userAge < minimum) {
        failedConditions.push(`Minimum age required is ${minimum} years (your input: ${userAge}).`);
      } else if (maximum !== null && userAge > maximum) {
        failedConditions.push(`Maximum age allowed is ${maximum} years (your input: ${userAge}).`);
      } else {
        passedConditions.push('Age requirement satisfied.');
      }
    }
  }
  
  // 2. Income Check
  if (el.income && el.income.maximumAnnualIncome !== null) {
    const limit = el.income.maximumAnnualIncome;
    if (answers.income !== undefined && answers.income !== null) {
      const userIncome = parseInt(answers.income);
      if (userIncome > limit) {
        failedConditions.push(`Annual income must not exceed ₹${limit.toLocaleString()} (your input: ₹${userIncome.toLocaleString()}).`);
      } else {
        passedConditions.push('Income requirement satisfied.');
      }
    }
  }
  
  // 3. Gender Check
  if (el.gender && el.gender.length > 0) {
    if (answers.gender !== undefined && answers.gender !== null && answers.gender !== '') {
      // Check if user's gender matches any of the scheme's gender list
      const matched = el.gender.some(g => g.toLowerCase() === answers.gender.toLowerCase());
      if (!matched) {
        failedConditions.push(`Scheme is restricted to: ${el.gender.join(', ')} (your input: ${answers.gender}).`);
      } else {
        passedConditions.push('Gender requirement satisfied.');
      }
    }
  }
  
  // 4. Occupation Check
  if (el.occupation && el.occupation.length > 0) {
    if (answers.occupation !== undefined && answers.occupation !== null && answers.occupation !== '') {
      const matched = el.occupation.some(o => o.toLowerCase() === answers.occupation.toLowerCase());
      if (!matched) {
        failedConditions.push(`Scheme is restricted to occupations: ${el.occupation.join(', ')} (your input: ${answers.occupation}).`);
      } else {
        passedConditions.push('Occupation requirement satisfied.');
      }
    }
  }
  
  // 5. Social Category Check
  if (el.socialCategory && el.socialCategory.length > 0) {
    if (answers.category !== undefined && answers.category !== null && answers.category !== '') {
      const matched = el.socialCategory.some(sc => sc.toLowerCase() === answers.category.toLowerCase());
      if (!matched) {
        failedConditions.push(`Scheme is restricted to social categories: ${el.socialCategory.join(', ')} (your input: ${answers.category}).`);
      } else {
        passedConditions.push('Social category requirement satisfied.');
      }
    }
  }
  
  // 6. Disability Check
  if (el.disability === true) {
    if (answers.disability !== undefined && answers.disability !== null) {
      const userDisability = answers.disability === true || answers.disability === 'true' || answers.disability === 'Yes';
      if (!userDisability) {
        failedConditions.push('Scheme is only available for Persons with Disabilities (PwD).');
      } else {
        passedConditions.push('Disability requirement satisfied.');
      }
    }
  }
  
  // 7. Residency/State Check
  if (el.residency && el.residency.states && el.residency.states.length > 0) {
    if (answers.state !== undefined && answers.state !== null && answers.state !== '') {
      const matched = el.residency.states.some(s => s.toLowerCase() === answers.state.toLowerCase());
      if (!matched) {
        failedConditions.push(`Scheme is only available for residents of: ${el.residency.states.join(', ')} (your input: ${answers.state}).`);
      } else {
        passedConditions.push('Residency requirement satisfied.');
      }
    }
  }
  
  // 8. Custom Questions Check
  if (el.customQuestions && el.customQuestions.length > 0) {
    for (const q of el.customQuestions) {
      if (answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '') {
        if (answers[q.id] !== q.expectedAnswer) {
          failedConditions.push(`For question: "${q.question}", your answer "${answers[q.id]}" did not match the eligibility criteria.`);
        } else {
          passedConditions.push(`Answered "${q.question}" correctly.`);
        }
      }
    }
  }
  
  // Determine final status
  let status = 'Eligible';
  let eligible = true;
  
  if (failedConditions.length > 0) {
    status = 'Not Eligible';
    eligible = false;
  } else {
    // Check if any checks were skipped because answers weren't provided
    const ageRequired = el.age && (el.age.minimum !== null || el.age.maximum !== null);
    const incomeRequired = el.income && el.income.maximumAnnualIncome !== null;
    const genderRequired = el.gender && el.gender.length > 0;
    const occupationRequired = el.occupation && el.occupation.length > 0;
    const categoryRequired = el.socialCategory && el.socialCategory.length > 0;
    const disabilityRequired = el.disability === true;
    const stateRequired = el.residency && el.residency.states && el.residency.states.length > 0;
    
    const missingCustomQuestions = el.customQuestions && el.customQuestions.some(q => 
      answers[q.id] === undefined || answers[q.id] === null || answers[q.id] === ''
    );
    
    const missingAnswers = 
      (ageRequired && (answers.age === undefined || answers.age === null)) ||
      (incomeRequired && (answers.income === undefined || answers.income === null)) ||
      (genderRequired && (answers.gender === undefined || answers.gender === null || answers.gender === '')) ||
      (occupationRequired && (answers.occupation === undefined || answers.occupation === null || answers.occupation === '')) ||
      (categoryRequired && (answers.category === undefined || answers.category === null || answers.category === '')) ||
      (disabilityRequired && (answers.disability === undefined || answers.disability === null)) ||
      (stateRequired && (answers.state === undefined || answers.state === null || answers.state === '')) ||
      missingCustomQuestions;
      
    if (missingAnswers) {
      status = 'Possibly Eligible';
      eligible = true; // Still show in recommendations but flag it
    }
  }
  
  return {
    eligible,
    status,
    failedConditions,
    passedConditions
  };
};

/**
 * Evaluates all active schemes against user answers.
 */
export const findMatchingSchemes = (answers) => {
  const schemes = getAllSchemes(false);
  const eligible = [];
  const possiblyEligible = [];
  const notEligible = [];
  
  for (const scheme of schemes) {
    const result = checkSchemeEligibility(scheme, answers);
    const item = {
      id: scheme.id,
      name: scheme.name,
      slug: scheme.slug,
      category: scheme.category,
      subcategory: scheme.subcategory,
      ministry: scheme.ministry,
      overview: scheme.overview,
      failedConditions: result.failedConditions,
      passedConditions: result.passedConditions
    };
    
    if (result.status === 'Eligible') {
      eligible.push(item);
    } else if (result.status === 'Possibly Eligible') {
      possiblyEligible.push(item);
    } else {
      notEligible.push(item);
    }
  }
  
  logEvent('info', 'Matching schemes search completed', {
    totalEligible: eligible.length,
    totalPossibly: possiblyEligible.length,
    totalNotEligible: notEligible.length
  });
  
  return {
    eligible,
    possiblyEligible,
    notEligible
  };
};

/**
 * Dynamically generates a questionnaire based on the scheme's eligibility criteria.
 */
export const generateSchemeQuestionnaire = (scheme) => {
  const el = scheme.eligibility;
  if (!el) return [];
  
  const questions = [];
  
  if (el.age && (el.age.minimum !== null || el.age.maximum !== null)) {
    questions.push({
      id: 'age',
      question: 'What is your age (in years)?',
      type: 'number',
      required: true,
      validation: {
        minimum: el.age.minimum,
        maximum: el.age.maximum,
        errorMessage: `Age must be between ${el.age.minimum || 0} and ${el.age.maximum || 120} years.`
      }
    });
  }
  
  if (el.income && el.income.maximumAnnualIncome !== null) {
    questions.push({
      id: 'income',
      question: 'What is your annual household income (in ₹)?',
      type: 'number',
      required: true,
      validation: {
        maximum: el.income.maximumAnnualIncome,
        errorMessage: `Annual household income must not exceed ₹${el.income.maximumAnnualIncome.toLocaleString()}.`
      }
    });
  }
  
  if (el.gender && el.gender.length > 0) {
    questions.push({
      id: 'gender',
      question: 'What is your gender?',
      type: 'dropdown',
      required: true,
      options: ['Male', 'Female', 'Other'],
      validation: {
        errorMessage: 'Gender is required.'
      }
    });
  }
  
  if (el.occupation && el.occupation.length > 0) {
    questions.push({
      id: 'occupation',
      question: 'What is your occupation?',
      type: 'dropdown',
      required: true,
      options: el.occupation,
      validation: {
        errorMessage: 'Occupation is required.'
      }
    });
  }
  
  if (el.socialCategory && el.socialCategory.length > 0) {
    questions.push({
      id: 'category',
      question: 'What is your social category?',
      type: 'dropdown',
      required: true,
      options: ['General', 'OBC', 'SC', 'ST'],
      validation: {
        errorMessage: 'Social category is required.'
      }
    });
  }
  
  if (el.disability === true) {
    questions.push({
      id: 'disability',
      question: 'Do you have a disability (PwD)?',
      type: 'dropdown',
      required: true,
      options: ['Yes', 'No'],
      validation: {
        errorMessage: 'Disability status is required.'
      }
    });
  }
  
  if (el.residency && el.residency.states && el.residency.states.length > 0) {
    questions.push({
      id: 'state',
      question: 'What is your state of residence?',
      type: 'dropdown',
      required: true,
      options: el.residency.states,
      validation: {
        errorMessage: 'State of residence is required.'
      }
    });
  }
  
  if (el.customQuestions && el.customQuestions.length > 0) {
    for (const q of el.customQuestions) {
      questions.push({
        id: q.id,
        question: q.question,
        type: q.type || 'dropdown',
        required: q.required !== undefined ? q.required : true,
        options: q.options || ['Yes', 'No'],
        validation: {
          errorMessage: 'This field is required.'
        }
      });
    }
  }
  
  return questions;
};

export default {
  checkSchemeEligibility,
  findMatchingSchemes,
  generateSchemeQuestionnaire
};
