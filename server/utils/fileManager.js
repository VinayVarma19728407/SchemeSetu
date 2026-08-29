import fs from 'fs';
import path from 'path';

/**
 * Safely reads and parses a JSON file.
 * If file does not exist, returns the defaultValue.
 */
export const readJson = (filePath, defaultValue = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Write default value
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error);
    return defaultValue;
  }
};

/**
 * Safely writes data to a JSON file atomically using a temporary file.
 */
export const writeJson = (filePath, data) => {
  const tempPath = `${filePath}.tmp`;
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to temporary file
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Rename temporary file to target file (atomic operation)
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`Error writing JSON file at ${filePath}:`, error);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // Ignore unlink error
      }
    }
    throw error;
  }
};

export default {
  readJson,
  writeJson
};
