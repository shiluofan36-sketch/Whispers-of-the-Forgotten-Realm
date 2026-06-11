import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { PORT, CORS_ORIGIN } from './config/index.js';
import { initDatabase, closePool } from './db/index.js';
import { seedAdmin } from './db/userDb.js';
import { errorHandler } from './utils/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import saveRoutes from './routes/saveRoutes.js';
import configRoutes from './routes/configRoutes.js';
import authRoutes from './routes/authRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1', healthRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', configRoutes);
app.use('/api/v1', saveRoutes);
app.use('/api/v1', suggestionRoutes);
app.use('/api/v1', adminRoutes);

app.use(errorHandler);

async function start() {
  try {
    console.log('[WotFR Server] Initializing database...');
    await initDatabase();
    await seedAdmin();
    console.log('[WotFR Server] Database ready');

    const server = app.listen(PORT, () => {
      console.log(`[WotFR Server] running on http://localhost:${PORT}`);
    });

    process.on('SIGTERM', async () => {
      server.close();
      await closePool();
      process.exit(0);
    });
  } catch (err) {
    console.error('[WotFR Server] Failed to start:', err);
    process.exit(1);
  }
}

start();
