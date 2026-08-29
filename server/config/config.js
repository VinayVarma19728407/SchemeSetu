import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv from root folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'schemesetu_jwt_secret_key_token_2026_auth',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dataDir: process.env.DATA_DIR || './data',
  uploadsDir: process.env.UPLOADS_DIR || './uploads',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@schemesetu.gov',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'AdminPassword123'
};

export default config;
