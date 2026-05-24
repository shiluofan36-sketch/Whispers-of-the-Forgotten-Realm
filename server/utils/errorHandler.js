export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  if (err.code === 'ENOENT') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}
