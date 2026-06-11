const BASE_URL = '/api/v1';
const TIMEOUT = 5000;

function getToken() {
  return localStorage.getItem('rpg_token');
}

async function request(method, path, body = null, auth = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = { method, headers, signal: controller.signal };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, opts);
    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') throw new Error('Request timeout');
    throw err;
  }
}

export const apiClient = {
  get: (path, auth = false) => request('GET', path, null, auth),
  post: (path, body, auth = false) => request('POST', path, body, auth),
  put: (path, body, auth = false) => request('PUT', path, body, auth),
  delete: (path, auth = false) => request('DELETE', path, null, auth),
};
