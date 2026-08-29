import path from 'path';
import config from '../config/config.js';
import { readJson, writeJson } from '../utils/fileManager.js';
import { getAllSchemes } from './SchemeService.js';
import { logEvent } from '../middleware/loggerMiddleware.js';

const getBookmarksFile = () => path.join(config.dataDir, 'users', 'bookmarks.json');

/**
 * Gets all bookmarked schemes for a user.
 */
export const getBookmarks = (userId) => {
  const bookmarksFile = getBookmarksFile();
  const entries = readJson(bookmarksFile, []);
  const entry = entries.find(e => e.userId === userId);
  
  if (!entry || !entry.bookmarks || entry.bookmarks.length === 0) {
    return [];
  }
  
  const allSchemes = getAllSchemes(true); // Include inactive just in case they saved it, or only active? Let's return active ones.
  const bookmarkedSchemes = allSchemes.filter(s => entry.bookmarks.includes(s.id));
  return bookmarkedSchemes;
};

/**
 * Adds a scheme to user's bookmarks.
 */
export const addBookmark = (userId, schemeId) => {
  const bookmarksFile = getBookmarksFile();
  const entries = readJson(bookmarksFile, []);
  let entry = entries.find(e => e.userId === userId);
  
  // Verify scheme exists
  const allSchemes = getAllSchemes(true);
  const schemeExists = allSchemes.some(s => s.id === schemeId);
  if (!schemeExists) {
    throw new Error(`Scheme with ID ${schemeId} does not exist.`);
  }
  
  if (!entry) {
    entry = { userId, bookmarks: [schemeId] };
    entries.push(entry);
  } else {
    if (entry.bookmarks.includes(schemeId)) {
      return entry.bookmarks; // Already bookmarked
    }
    entry.bookmarks.push(schemeId);
  }
  
  writeJson(bookmarksFile, entries);
  logEvent('info', 'Bookmark added', { userId, schemeId });
  return entry.bookmarks;
};

/**
 * Removes a scheme from user's bookmarks.
 */
export const removeBookmark = (userId, schemeId) => {
  const bookmarksFile = getBookmarksFile();
  const entries = readJson(bookmarksFile, []);
  const entry = entries.find(e => e.userId === userId);
  
  if (!entry) {
    return [];
  }
  
  const index = entry.bookmarks.indexOf(schemeId);
  if (index !== -1) {
    entry.bookmarks.splice(index, 1);
    writeJson(bookmarksFile, entries);
    logEvent('info', 'Bookmark removed', { userId, schemeId });
  }
  
  return entry.bookmarks;
};

export default {
  getBookmarks,
  addBookmark,
  removeBookmark
};
