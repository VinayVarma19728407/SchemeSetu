/**
 * Helper to check email format.
 */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates registration request body.
 */
export const validateSignup = (req) => {
  const { name, email, password } = req.body;
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('Name is required.');
  }
  
  if (!email || email.trim() === '') {
    errors.push('Email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }
  
  return errors;
};

/**
 * Validates login request body.
 */
export const validateLogin = (req) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email || email.trim() === '') {
    errors.push('Email is required.');
  } else if (!isValidEmail(email)) {
    errors.push('Please enter a valid email address.');
  }
  
  if (!password || password.trim() === '') {
    errors.push('Password is required.');
  }
  
  return errors;
};

export default {
  validateSignup,
  validateLogin
};
