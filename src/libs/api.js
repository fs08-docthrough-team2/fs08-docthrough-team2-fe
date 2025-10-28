import axios from 'axios';
import { clearAccessToken, getAccessToken, isBrowser, setAccessToken } from './token.js';

const BASE_URL = 'https://fs08-docthrough.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  adapter: 'fetch',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/token/refresh');
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        clearAccessToken();

        if (isBrowser) window.location.href = '/auth/login';

        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
