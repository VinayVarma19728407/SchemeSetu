import fs from 'fs';
import path from 'path';
import config from '../config/config.js';
import { readJson, writeJson } from '../utils/fileManager.js';
import { logEvent } from '../middleware/loggerMiddleware.js';

const getCategoriesDir = () => path.join(config.dataDir, 'categories');

/**
 * Normalizes a category name to its JSON file name.
 * e.g., 'Women & Child Development' -> 'women.json'
 */
const categoryToFilenameMap = {
  'agriculture': 'agriculture.json',
  'education': 'education.json',
  'employment': 'employment.json',
  'financial assistance': 'financial.json',
  'food & public distribution': 'food.json',
  'green india & environment': 'green-india.json',
  'health': 'health.json',
  'housing': 'housing.json',
  'infrastructure': 'infrastructure.json',
  'insurance': 'insurance.json',
  'msme': 'msme.json',
  'pension': 'pension.json',
  'senior citizens': 'senior-citizens.json',
  'skill development': 'skill-development.json',
  'startups & entrepreneurship': 'startup.json',
  'students': 'students.json',
  'women & child development': 'women.json'
};

const getFilenameForCategory = (category) => {
  const norm = category.toLowerCase().trim();
  return categoryToFilenameMap[norm] || `${norm.replace(/[^a-z0-9]/g, '-')}.json`;
};

/**
 * Gets all schemes from all category files.
 */
export const getAllSchemes = (includeInactive = false) => {
  const dir = getCategoriesDir();
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let allSchemes = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const schemes = readJson(filePath, []);
    allSchemes = allSchemes.concat(schemes);
  }
  
  if (!includeInactive) {
    return allSchemes.filter(s => s.status === 'Active');
  }
  
  return allSchemes;
};

/**
 * Retrieves schemes with search, category filtering, and pagination.
 */
export const getSchemes = (query = {}) => {
  const { page = 1, limit = 20, category, search, sort = 'name' } = query;
  
  let schemes = getAllSchemes(false);
  
  // Category Filter
  if (category && category !== 'All' && category.trim() !== '') {
    schemes = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  
  // Search Filter
  if (search && search.trim() !== '') {
    const keyword = search.toLowerCase().trim();
    schemes = schemes.filter(s => {
      const nameMatch = s.name.toLowerCase().includes(keyword);
      const descMatch = s.overview && s.overview.toLowerCase().includes(keyword);
      const ministryMatch = typeof s.ministry === 'object' 
        ? s.ministry.name.toLowerCase().includes(keyword)
        : s.ministry.toLowerCase().includes(keyword);
      const tagMatch = s.tags && s.tags.some(t => t.toLowerCase().includes(keyword));
      const keywordMatch = s.keywords && s.keywords.some(k => k.toLowerCase().includes(keyword));
      
      return nameMatch || descMatch || ministryMatch || tagMatch || keywordMatch;
    });
    
    // Log search query for analytics
    logEvent('info', 'Scheme search executed', { keyword, resultsCount: schemes.length });
  }
  
  // Sorting
  if (sort === 'name') {
    schemes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'recent') {
    schemes.sort((a, b) => new Date(b.metadata?.updatedAt || b.updatedAt || 0) - new Date(a.metadata?.updatedAt || a.updatedAt || 0));
  } else if (sort === 'popular') {
    schemes.sort((a, b) => (b.analytics?.popular ? 1 : 0) - (a.analytics?.popular ? 1 : 0));
  }
  
  // Pagination
  const totalRecords = schemes.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const currentPage = Math.max(1, parseInt(page));
  const offset = (currentPage - 1) * limit;
  const paginatedSchemes = schemes.slice(offset, offset + parseInt(limit));
  
  return {
    schemes: paginatedSchemes,
    pagination: {
      totalRecords,
      totalPages,
      currentPage,
      limit: parseInt(limit),
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }
  };
};

/**
 * Gets a single scheme by its slug.
 */
export const getSchemeBySlug = (slug) => {
  const schemes = getAllSchemes(true);
  const scheme = schemes.find(s => s.slug === slug);
  if (scheme) {
    // Record view analytics
    logEvent('info', 'Scheme viewed', { schemeId: scheme.id, slug });
  }
  return scheme;
};

/**
 * Gets featured schemes.
 */
export const getFeaturedSchemes = (limit = 6) => {
  const schemes = getAllSchemes(false);
  return schemes.filter(s => s.analytics?.featured || s.featured).slice(0, limit);
};

/**
 * Gets recently added schemes.
 */
export const getRecentSchemes = (limit = 6) => {
  const schemes = getAllSchemes(false);
  return schemes
    .filter(s => s.analytics?.recentlyAdded || s.recentlyAdded)
    .sort((a, b) => new Date(b.metadata?.createdAt || b.createdAt || 0) - new Date(a.metadata?.createdAt || a.createdAt || 0))
    .slice(0, limit);
};

/**
 * Adds a new scheme (Admin CRUD).
 */
export const createScheme = (schemeData) => {
  const categoryFilename = getFilenameForCategory(schemeData.category);
  const filePath = path.join(getCategoriesDir(), categoryFilename);
  
  const schemes = readJson(filePath, []);
  
  // Check duplicate ID or slug
  const allSchemes = getAllSchemes(true);
  if (allSchemes.some(s => s.id === schemeData.id)) {
    throw new Error(`Scheme with ID ${schemeData.id} already exists.`);
  }
  if (allSchemes.some(s => s.slug === schemeData.slug)) {
    throw new Error(`Scheme with slug ${schemeData.slug} already exists.`);
  }
  
  const newScheme = {
    ...schemeData,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0'
    }
  };
  
  schemes.push(newScheme);
  writeJson(filePath, schemes);
  logEvent('info', 'Scheme created by admin', { schemeId: newScheme.id, name: newScheme.name });
  return newScheme;
};

/**
 * Updates an existing scheme (Admin CRUD).
 */
export const updateScheme = (id, updatedData) => {
  // Find which file contains the scheme
  const dir = getCategoriesDir();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let foundFilePath = null;
  let schemes = [];
  let index = -1;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    schemes = readJson(filePath, []);
    index = schemes.findIndex(s => s.id === id);
    if (index !== -1) {
      foundFilePath = filePath;
      break;
    }
  }
  
  if (index === -1) {
    throw new Error(`Scheme with ID ${id} not found.`);
  }
  
  const currentScheme = schemes[index];
  
  // Check slug duplicate if slug is changing
  if (updatedData.slug && updatedData.slug !== currentScheme.slug) {
    const allSchemes = getAllSchemes(true);
    if (allSchemes.some(s => s.slug === updatedData.slug && s.id !== id)) {
      throw new Error(`Scheme with slug ${updatedData.slug} already exists.`);
    }
  }
  
  const updatedScheme = {
    ...currentScheme,
    ...updatedData,
    id, // Ensure ID cannot be changed
    metadata: {
      ...currentScheme.metadata,
      updatedAt: new Date().toISOString(),
      version: (parseFloat(currentScheme.metadata?.version || '1.0') + 0.1).toFixed(1)
    }
  };
  
  // If the category changed, we must move the scheme to the new category file
  if (updatedData.category && updatedData.category !== currentScheme.category) {
    // Remove from old file
    schemes.splice(index, 1);
    writeJson(foundFilePath, schemes);
    
    // Add to new file
    const newCategoryFilename = getFilenameForCategory(updatedData.category);
    const newFilePath = path.join(dir, newCategoryFilename);
    const newCategorySchemes = readJson(newFilePath, []);
    newCategorySchemes.push(updatedScheme);
    writeJson(newFilePath, newCategorySchemes);
  } else {
    // Save in same file
    schemes[index] = updatedScheme;
    writeJson(foundFilePath, schemes);
  }
  
  logEvent('info', 'Scheme updated by admin', { schemeId: id, name: updatedScheme.name });
  return updatedScheme;
};

/**
 * Deletes a scheme (Admin CRUD).
 */
export const deleteScheme = (id) => {
  const dir = getCategoriesDir();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  let foundFilePath = null;
  let schemes = [];
  let index = -1;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    schemes = readJson(filePath, []);
    index = schemes.findIndex(s => s.id === id);
    if (index !== -1) {
      foundFilePath = filePath;
      break;
    }
  }
  
  if (index === -1) {
    throw new Error(`Scheme with ID ${id} not found.`);
  }
  
  const deletedScheme = schemes.splice(index, 1)[0];
  writeJson(foundFilePath, schemes);
  
  logEvent('info', 'Scheme deleted by admin', { schemeId: id, name: deletedScheme.name });
  return deletedScheme;
};

export default {
  getAllSchemes,
  getSchemes,
  getSchemeBySlug,
  getFeaturedSchemes,
  getRecentSchemes,
  createScheme,
  updateScheme,
  deleteScheme
};
