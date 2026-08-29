import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '../logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'access.log');

/**
 * Express middleware to log requests.
 */
export const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${ip} - ${method} ${originalUrl} - Status: ${statusCode} - Time: ${duration}ms\n`;
    
    // Log to console
    console.log(logMessage.trim());
    
    // Log to file
    fs.appendFile(logFile, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to access log:', err);
      }
    });
  });
  
  next();
};

/**
 * Log helper for general system logs.
 */
export const logEvent = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}\n`;
  
  const systemLogFile = path.join(logDir, 'system.log');
  
  console.log(logMessage.trim());
  
  fs.appendFile(systemLogFile, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to system log:', err);
    }
  });
};

export default {
  logger,
  logEvent
};
