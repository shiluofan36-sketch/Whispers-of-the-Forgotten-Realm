import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = process.env.PORT || 3001;
export const SAVES_DIR = path.join(__dirname, '..', 'saves');
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
