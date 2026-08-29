import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import { readJson, writeJson } from './fileManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically initializes folders and files on server start.
 */
export const initDb = async () => {
  console.log('Initializing JSON database...');
  
  // 1. Ensure required folders exist
  const folders = [
    path.join(config.dataDir, 'categories'),
    path.join(config.dataDir, 'users'),
    path.join(config.dataDir, 'admin'),
    path.join(config.dataDir, 'analytics'),
    path.join(config.dataDir, 'metadata'),
    config.uploadsDir
  ];
  
  folders.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
  
  // 2. Initialize default admin if not present
  const adminFile = path.join(config.dataDir, 'admin', 'admin.json');
  if (!fs.existsSync(adminFile) || readJson(adminFile, []).length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.defaultAdminPassword, salt);
    
    const adminRecord = {
      id: 'ADM001',
      email: config.defaultAdminEmail,
      password: hashedPassword,
      role: 'Administrator'
    };
    
    writeJson(adminFile, adminRecord);
    console.log(`Created default admin account: ${config.defaultAdminEmail}`);
  }
  
  // 3. Initialize user tracking files
  const usersFile = path.join(config.dataDir, 'users', 'users.json');
  if (!fs.existsSync(usersFile)) {
    writeJson(usersFile, []);
  }
  
  const bookmarksFile = path.join(config.dataDir, 'users', 'bookmarks.json');
  if (!fs.existsSync(bookmarksFile)) {
    writeJson(bookmarksFile, []);
  }
  
  const profilesFile = path.join(config.dataDir, 'users', 'profiles.json');
  if (!fs.existsSync(profilesFile)) {
    writeJson(profilesFile, []);
  }
  
  // 4. Initialize analytics tracking files
  const searchesFile = path.join(config.dataDir, 'analytics', 'searches.json');
  if (!fs.existsSync(searchesFile)) {
    writeJson(searchesFile, []);
  }
  
  const viewsFile = path.join(config.dataDir, 'analytics', 'views.json');
  if (!fs.existsSync(viewsFile)) {
    writeJson(viewsFile, []);
  }
  
  const bookmarkStatsFile = path.join(config.dataDir, 'analytics', 'bookmarks.json');
  if (!fs.existsSync(bookmarkStatsFile)) {
    writeJson(bookmarkStatsFile, []);
  }
  
  // 5. Initialize metadata mappings if missing
  const categoriesMetaFile = path.join(config.dataDir, 'metadata', 'categories.json');
  if (!fs.existsSync(categoriesMetaFile)) {
    const categoriesMeta = [
      { id: 'CAT001', name: 'Agriculture', icon: 'agriculture.png' },
      { id: 'CAT002', name: 'Education', icon: 'education.png' },
      { id: 'CAT003', name: 'Employment', icon: 'employment.png' },
      { id: 'CAT004', name: 'Financial Assistance', icon: 'financial.png' },
      { id: 'CAT005', name: 'Food & Public Distribution', icon: 'food.png' },
      { id: 'CAT006', name: 'Green India & Environment', icon: 'green-india.png' },
      { id: 'CAT007', name: 'Health', icon: 'health.png' },
      { id: 'CAT008', name: 'Housing', icon: 'housing.png' },
      { id: 'CAT009', name: 'Infrastructure', icon: 'infrastructure.png' },
      { id: 'CAT010', name: 'Insurance', icon: 'insurance.png' },
      { id: 'CAT011', name: 'MSME', icon: 'msme.png' },
      { id: 'CAT012', name: 'Pension', icon: 'pension.png' },
      { id: 'CAT013', name: 'Senior Citizens', icon: 'senior-citizens.png' },
      { id: 'CAT014', name: 'Skill Development', icon: 'skill-development.png' },
      { id: 'CAT015', name: 'Startups & Entrepreneurship', icon: 'startup.png' },
      { id: 'CAT016', name: 'Students', icon: 'students.png' },
      { id: 'CAT017', name: 'Women & Child Development', icon: 'women.png' }
    ];
    writeJson(categoriesMetaFile, categoriesMeta);
    console.log('Created categories metadata file.');
  }
  
  const ministriesMetaFile = path.join(config.dataDir, 'metadata', 'ministries.json');
  if (!fs.existsSync(ministriesMetaFile)) {
    const ministriesMeta = [
      { id: 'MIN001', name: 'Ministry of Agriculture and Farmers Welfare' },
      { id: 'MIN002', name: 'Ministry of Education' },
      { id: 'MIN003', name: 'Ministry of Finance' },
      { id: 'MIN004', name: 'Ministry of Health and Family Welfare' },
      { id: 'MIN005', name: 'Ministry of Housing and Urban Affairs' },
      { id: 'MIN006', name: 'Ministry of Labour and Employment' },
      { id: 'MIN007', name: 'Ministry of Micro, Small and Medium Enterprises' },
      { id: 'MIN008', name: 'Ministry of Skill Development and Entrepreneurship' },
      { id: 'MIN009', name: 'Ministry of Women and Child Development' },
      { id: 'MIN010', name: 'Ministry of Consumer Affairs, Food and Public Distribution' },
      { id: 'MIN011', name: 'Ministry of Environment, Forest and Climate Change' }
    ];
    writeJson(ministriesMetaFile, ministriesMeta);
    console.log('Created ministries metadata file.');
  }
  
  // 6. Copy dataset categories if data/categories is empty
  const sourceDir = path.join(__dirname, '../../dataset_extracted/categories');
  const destDir = path.join(config.dataDir, 'categories');
  
  if (fs.existsSync(sourceDir)) {
    const destFiles = fs.readdirSync(destDir).filter(f => f.endsWith('.json'));
    if (destFiles.length === 0) {
      const srcFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));
      srcFiles.forEach(file => {
        fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
        console.log(`Copied dataset file: ${file}`);
      });
      console.log('Imported all scheme categories from dataset unzipped folder.');
    }
  } else {
    console.warn(`Warning: Dataset source folder not found at ${sourceDir}`);
  }
  
  console.log('JSON database initialized successfully.');
};

export default initDb;
