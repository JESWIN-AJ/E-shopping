import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let adminToken = null;

export const setAdminToken = (token) => { adminToken = token; };
export const clearAdminToken = () => { adminToken = null; };

api.interceptors.request.use((config) => {
  if (adminToken) {
    config.headers['Authorization'] = `Bearer ${adminToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;