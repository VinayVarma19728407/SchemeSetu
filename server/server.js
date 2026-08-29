import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';
import initDb from './utils/initDb.js';
import { logger } from './middleware/loggerMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import eligibilityRoutes from './routes/eligibilityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize JSON database
await initDb();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading uploaded images in React client
}));
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());
app.use(logger);

// Rate Limiting (applied globally to all API routes)
app.use('/api', apiLimiter);

// Serve uploads static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend in Production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
} else {
  // Root API route status
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'SchemeSetu API Server is running in development mode.'
    });
  });
}

// Fallback 404 Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
});
