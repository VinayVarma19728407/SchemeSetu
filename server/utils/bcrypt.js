import bcrypt from 'bcryptjs';

/**
 * Hashes a plain text password.
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares plain text password with hashed password.
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export default {
  hashPassword,
  comparePassword
};
