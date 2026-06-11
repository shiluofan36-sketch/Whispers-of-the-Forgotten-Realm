import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT || 3001;
export const SAVES_DIR = path.join(__dirname, '..', 'saves');
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

export const DB_CONFIG = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'rpg_game',
};

export const JWT_SECRET = process.env.JWT_SECRET || 'rpg_game_secret_key_2024';
export const JWT_EXPIRES_IN = '7d';
