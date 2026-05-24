import express from 'express';
import cors from 'cors';
import compression from 'compression';
import fs from 'fs';
import { PORT, SAVES_DIR, CORS_ORIGIN } from './config/index.js';
import { errorHandler } from './utils/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import saveRoutes from './routes/saveRoutes.js';
import configRoutes from './routes/configRoutes.js';

const app = express();

// Ensure saves directory exists
fs.mkdirSync(SAVES_DIR, { recursive: true });

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1', saveRoutes);
app.use('/api/v1', configRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[RPG Server] running on http://localhost:${PORT}`);
  console.log(`[RPG Server] saves directory: ${SAVES_DIR}`);
});
