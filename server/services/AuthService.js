import path from 'path';
import config from '../config/config.js';
import { readJson, writeJson } from '../utils/fileManager.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { logEvent } from '../middleware/loggerMiddleware.js';

const getUsersFile = () => path.join(config.dataDir, 'users', 'users.json');
const getProfilesFile = () => path.join(config.dataDir, 'users', 'profiles.json');
const getBookmarksFile = () => path.join(config.dataDir, 'users', 'bookmarks.json');

/**
 * Creates a new user account.
 */
export const signup = async (name, email, password) => {
  const usersFile = getUsersFile();
  const users = readJson(usersFile, []);
  
  // Check if email already registered
  const emailNorm = email.toLowerCase().trim();
  if (users.some(u => u.email.toLowerCase() === emailNorm)) {
    throw new Error('Email address already registered.');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  const userId = `USR${String(users.length + 1).padStart(3, '0')}`;
  const newUser = {
    id: userId,
    name: name.trim(),
    email: emailNorm,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isVerified: false
  };
  
  users.push(newUser);
  writeJson(usersFile, users);
  
  // Initialize profile
  const profilesFile = getProfilesFile();
  const profiles = readJson(profilesFile, []);
  const defaultProfile = {
    userId,
    age: null,
    gender: '',
    occupation: '',
    income: null,
    state: '',
    district: '',
    category: 'General'
  };
  profiles.push(defaultProfile);
  writeJson(profilesFile, profiles);
  
  // Initialize bookmarks entry
  const bookmarksFile = getBookmarksFile();
  const bookmarkEntries = readJson(bookmarksFile, []);
  bookmarkEntries.push({
    userId,
    bookmarks: []
  });
  writeJson(bookmarksFile, bookmarkEntries);
  
  logEvent('info', 'User signup successful', { userId, email: emailNorm });
  
  const token = generateToken(userId, 'User');
  return {
    token,
    user: {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  };
};

/**
 * Authenticates a user and returns a token.
 */
export const login = async (email, password) => {
  const emailNorm = email.toLowerCase().trim();
  
  // Check user database
  const usersFile = getUsersFile();
  const users = readJson(usersFile, []);
  const user = users.find(u => u.email.toLowerCase() === emailNorm);
  
  if (!user) {
    // If not in user database, check admin database
    const adminFile = path.join(config.dataDir, 'admin', 'admin.json');
    const adminData = readJson(adminFile, {});
    
    // adminData might be a single object or an array. Let's handle both.
    let adminObj = null;
    if (Array.isArray(adminData)) {
      adminObj = adminData.find(a => a.email.toLowerCase() === emailNorm);
    } else if (adminData.email && adminData.email.toLowerCase() === emailNorm) {
      adminObj = adminData;
    }
    
    if (adminObj) {
      const isMatch = await comparePassword(password, adminObj.password);
      if (!isMatch) {
        logEvent('warn', 'Admin login failed - incorrect password', { email: emailNorm });
        throw new Error('Invalid email or password.');
      }
      
      logEvent('info', 'Admin login successful', { adminId: adminObj.id || 'ADM001', email: emailNorm });
      const token = generateToken(adminObj.id || 'ADM001', 'Administrator');
      
      return {
        token,
        user: {
          id: adminObj.id || 'ADM001',
          name: 'Administrator',
          email: adminObj.email,
          role: 'Administrator'
        }
      };
    }
    
    logEvent('warn', 'Login failed - email not found', { email: emailNorm });
    throw new Error('Invalid email or password.');
  }
  
  // Compare passwords
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    logEvent('warn', 'User login failed - incorrect password', { userId: user.id, email: emailNorm });
    throw new Error('Invalid email or password.');
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  writeJson(usersFile, users);
  
  logEvent('info', 'User login successful', { userId: user.id, email: emailNorm });
  const token = generateToken(user.id, 'User');
  
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'User',
      createdAt: user.createdAt
    }
  };
};

/**
 * Gets user profile.
 */
export const getProfile = (userId) => {
  const profilesFile = getProfilesFile();
  const profiles = readJson(profilesFile, []);
  const profile = profiles.find(p => p.userId === userId);
  return profile || {
    userId,
    age: null,
    gender: '',
    occupation: '',
    income: null,
    state: '',
    district: '',
    category: 'General'
  };
};

/**
 * Updates user profile.
 */
export const updateProfile = (userId, profileData) => {
  const profilesFile = getProfilesFile();
  const profiles = readJson(profilesFile, []);
  const index = profiles.findIndex(p => p.userId === userId);
  
  const updatedProfile = {
    userId,
    age: profileData.age !== undefined ? (profileData.age ? parseInt(profileData.age) : null) : null,
    gender: profileData.gender || '',
    occupation: profileData.occupation || '',
    income: profileData.income !== undefined ? (profileData.income ? parseInt(profileData.income) : null) : null,
    state: profileData.state || '',
    district: profileData.district || '',
    category: profileData.category || 'General'
  };
  
  if (index === -1) {
    profiles.push(updatedProfile);
  } else {
    profiles[index] = updatedProfile;
  }
  
  writeJson(profilesFile, profiles);
  logEvent('info', 'User profile updated', { userId });
  return updatedProfile;
};

export default {
  signup,
  login,
  getProfile,
  updateProfile
};
