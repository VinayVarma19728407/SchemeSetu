import path from 'path';
import config from '../config/config.js';
import { readJson, writeJson } from '../utils/fileManager.js';

const getSearchesFile = () => path.join(config.dataDir, 'analytics', 'searches.json');
const getViewsFile = () => path.join(config.dataDir, 'analytics', 'views.json');
const getBookmarkStatsFile = () => path.join(config.dataDir, 'analytics', 'bookmarks.json');

/**
 * Logs a search query keyword and its result count.
 */
export const logSearch = (keyword, results) => {
  const file = getSearchesFile();
  const logs = readJson(file, []);
  logs.push({
    keyword,
    timestamp: new Date().toISOString(),
    results
  });
  writeJson(file, logs);
};

/**
 * Logs a scheme view event.
 */
export const logView = (schemeId) => {
  const file = getViewsFile();
  const logs = readJson(file, []);
  
  const existing = logs.find(l => l.schemeId === schemeId);
  if (existing) {
    existing.views += 1;
    existing.lastViewed = new Date().toISOString();
  } else {
    logs.push({
      schemeId,
      views: 1,
      lastViewed: new Date().toISOString()
    });
  }
  
  writeJson(file, logs);
};

/**
 * Logs a bookmark addition or removal event.
 */
export const logBookmarkEvent = (schemeId, countChange) => {
  const file = getBookmarkStatsFile();
  const logs = readJson(file, []);
  
  const existing = logs.find(l => l.schemeId === schemeId);
  if (existing) {
    existing.bookmarks = Math.max(0, existing.bookmarks + countChange);
  } else if (countChange > 0) {
    logs.push({
      schemeId,
      bookmarks: 1
    });
  }
  
  writeJson(file, logs);
};

export default {
  logSearch,
  logView,
  logBookmarkEvent
};
