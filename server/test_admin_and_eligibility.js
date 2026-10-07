import AuthService from './services/AuthService.js';
import AdminService from './services/AdminService.js';
import SchemeService from './services/SchemeService.js';
import EligibilityService from './services/EligibilityService.js';

async function runTests() {
  console.log('=== STEP 1: TEST ADMIN AUTHENTICATION ===');
  const authResult = await AuthService.login('admin@schemesetu.gov', 'AdminPassword123');
  console.log('? Admin login succeeded:', authResult.user.email, 'Role:', authResult.user.role);

  console.log('\n=== STEP 2: TEST ADMIN DASHBOARD & METRICS ===');
  const stats = AdminService.getDashboardStats();
  console.log('? Dashboard stats retrieved: Total categories in chart:', stats.categoryDistribution?.length);

  const categories = AdminService.getCategoriesBreakdown();
  console.log('? Categories breakdown retrieved:', categories.length, 'categories found');

  const users = AdminService.getUsersList();
  console.log('? Registered citizens retrieved:', users.length, 'citizens found');

  console.log('\n=== STEP 3: CREATE SCHEME WITH DEMOGRAPHIC CRITERIA & CUSTOM ELIGIBILITY QUESTION ===');
  const testSchemePayload = {
    id: 'SCH_TEST_ORGANIC',
    name: 'National Organic Farming Incentive Scheme',
    category: 'Agriculture',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    overview: 'Incentive program for organic farm conversion and eco-friendly practices.',
    officialInfoLink: 'https://agricoop.gov.in/organic',
    officialApplyLink: 'https://agricoop.gov.in/apply',
    status: 'Active',
    eligibility: {
      age: { minimum: 18, maximum: 65 },
      income: { maximumAnnualIncome: 350000 },
      gender: ['Male', 'Female'],
      occupation: ['Farmer'],
      socialCategory: ['General', 'OBC', 'SC', 'ST'],
      disability: false,
      residency: { states: [] },
      customQuestions: [
        {
          id: 'q_organic_cert',
          question: 'Do you cultivate land following accredited organic farming guidelines?',
          type: 'dropdown',
          options: ['Yes', 'No'],
          expectedAnswer: 'Yes',
          required: true
        }
      ]
    },
    objectives: ['Promote pesticide-free farming'],
    benefits: [{ title: 'Direct Subsidy', description: 'Rs 15000 per hectare' }],
    requiredDocuments: ['Aadhaar Card', 'Land Document'],
    applicationProcess: ['Apply on portal', 'Field verification']
  };

  const created = SchemeService.createScheme(testSchemePayload);
  console.log('? Test scheme created successfully with ID:', created.id, 'Slug:', created.slug);

  console.log('\n=== STEP 4: VERIFY ELIGIBILITY QUESTIONNAIRE GENERATION ===');
  const questionnaire = EligibilityService.generateSchemeQuestionnaire(created);
  console.log('? Questionnaire generated with', questionnaire.length, 'questions:');
  questionnaire.forEach(q => console.log('  -', q.id, ':', q.question, '(Type:', q.type, ')'));

  const hasCustomQ = questionnaire.some(q => q.id === 'q_organic_cert');
  if (!hasCustomQ) throw new Error('Failed: custom question q_organic_cert not in questionnaire!');
  console.log('? Verified custom question is present in generated questionnaire!');

  console.log('\n=== STEP 5: VERIFY ELIGIBILITY EVALUATION ===');
  // Test 5A: Fully eligible candidate
  const eligibleAnswers = {
    age: 35,
    income: 200000,
    gender: 'Female',
    occupation: 'Farmer',
    category: 'OBC',
    q_organic_cert: 'Yes'
  };
  const resultEligible = EligibilityService.checkSchemeEligibility(created, eligibleAnswers);
  console.log('? Candidate A (Valid Answers): Status =', resultEligible.status, '| Eligible =', resultEligible.eligible);
  if (resultEligible.status !== 'Eligible') {
    throw new Error('Candidate A should be eligible but was: ' + resultEligible.status);
  }

  // Test 5B: Candidate answering 'No' to custom question
  const ineligibleAnswers = {
    age: 35,
    income: 200000,
    gender: 'Female',
    occupation: 'Farmer',
    category: 'OBC',
    q_organic_cert: 'No'
  };
  const resultIneligible = EligibilityService.checkSchemeEligibility(created, ineligibleAnswers);
  console.log('? Candidate B (Disqualifying Answer): Status =', resultIneligible.status, '| Eligible =', resultIneligible.eligible);
  console.log('  Failed conditions:', resultIneligible.failedConditions);
  if (resultIneligible.eligible !== false) {
    throw new Error('Candidate B should NOT be eligible due to custom question mismatch!');
  }

  console.log('\n=== STEP 6: CLEAN UP TEST SCHEME ===');
  const deleted = SchemeService.deleteScheme(created.id);
  console.log('? Test scheme deleted:', deleted.name);

  console.log('\n=============================================');
  console.log('?? ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('? Test failed with error:', err);
  process.exit(1);
});
