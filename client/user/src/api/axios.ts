// src/api/axios.ts
import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,  // CRITICAL: send cookies cross-origin
});

// api.interceptors.request.use((config) => {
//   const csrfToken = document.cookie
//     .split('; ')
//     .find(row => row.startsWith('_csrf='))  // was 'csrf-token='
//     ?.split('=')[1];
//   if (csrfToken) {
//     config.headers['x-csrf-token'] = csrfToken;
//   }
//   return config;
// });


let csrfToken: string | null = null;

const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await api.get('/csrf-token');
  csrfToken = response.data.csrfToken;

  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();

  // Only send CSRF token for state-changing requests
  if (method === 'post' || method === 'put' || method === 'patch' || method === 'delete') {
    const token = await getCsrfToken();

    config.headers['x-csrf-token'] = token;
  }

  return config;
});



// Handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api