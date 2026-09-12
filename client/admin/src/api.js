import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the session cookie ('sid') and CSRF cookie automatically
});

// ---- CSRF token handling ----
// Your backend's csrfHeader middleware sends the current token back on
// EVERY response via the x-csrf-token header. Cache it and attach it to
// every state-changing request.
let csrfToken = null;

const UNSAFE_METHODS = ['post', 'put', 'patch', 'delete'];

api.interceptors.request.use((config) => {
  if (csrfToken && UNSAFE_METHODS.includes(config.method)) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    const token = res.headers['x-csrf-token'];
    if (token) csrfToken = token;
    return res;
  },
  (err) => {
    const token = err.response?.headers?.['x-csrf-token'];
    if (token) csrfToken = token;

    if (err.response?.status === 401 || err.response?.status === 403) {
      // No more localStorage to clear — the session lives server-side in
      // Redis and the cookie is httpOnly, so there's nothing for JS to
      // remove. Just redirect.
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Call this once on app load (e.g. in App.jsx's root useEffect), before
// any admin action that needs a CSRF token can fire.
export const primeCsrfToken = async () => {
  try {
    await api.get('/admin/me');
  } catch {
    // Ignore — admin might just be logged out. Token still gets cached
    // from the response headers above regardless of status.
  }
};

export default api;