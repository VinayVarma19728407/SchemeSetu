import path from 'path';
import fs from 'fs';
import config from '../config/config.js';
import { readJson } from '../utils/fileManager.js';
import { getAllSchemes } from './SchemeService.js';

const getUsersFile = () => path.join(config.dataDir, 'users', 'users.json');
const getBookmarksFile = () => path.join(config.dataDir, 'users', 'bookmarks.json');
const getCategoriesDir = () => path.join(config.dataDir, 'categories');

/**
 * Gets dashboard statistics.
 */
export const getDashboardStats = () => {
  const allSchemes = getAllSchemes(true);
  const users = readJson(getUsersFile(), []);
  
  // Count categories
  const categoriesDir = getCategoriesDir();
  let categoriesCount = 0;
  if (fs.existsSync(categoriesDir)) {
    categoriesCount = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json')).length;
  }
  
  // Bookmarks count
  const bookmarkEntries = readJson(getBookmarksFile(), []);
  let totalBookmarks = 0;
  const schemeBookmarkCounts = {}; // schemeId -> count
  
  bookmarkEntries.forEach(entry => {
    if (entry.bookmarks && Array.isArray(entry.bookmarks)) {
      totalBookmarks += entry.bookmarks.length;
      entry.bookmarks.forEach(sid => {
        schemeBookmarkCounts[sid] = (schemeBookmarkCounts[sid] || 0) + 1;
      });
    }
  });
  
  // Sort bookmarked schemes
  const sortedBookmarks = Object.entries(schemeBookmarkCounts)
    .map(([schemeId, count]) => {
      const scheme = allSchemes.find(s => s.id === schemeId);
      return {
        schemeId,
        name: scheme ? scheme.name : 'Unknown Scheme',
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
    
  // Scheme counts by category (for charts)
  const categoryCounts = {};
  allSchemes.forEach(s => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });
  const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));
  
  // Recent Schemes
  const recentSchemes = allSchemes
    .sort((a, b) => new Date(b.metadata?.createdAt || 0) - new Date(a.metadata?.createdAt || 0))
    .slice(0, 5)
    .map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      createdAt: s.metadata?.createdAt || new Date().toISOString()
    }));
    
  // Mock views analytics for presentation (dynamic views counter)
  const popularSchemes = allSchemes
    .filter(s => s.analytics?.popular)
    .slice(0, 5)
    .map((s, idx) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      views: 345 - (idx * 45) + (schemeBookmarkCounts[s.id] || 0) * 12
    }));

  return {
    totalSchemes: allSchemes.length,
    totalUsers: users.length,
    totalCategories: categoriesCount,
    totalBookmarks,
    categoryDistribution,
    mostBookmarked: sortedBookmarks,
    mostViewed: popularSchemes,
    recentSchemes
  };
};

export default {
  getDashboardStats
};
