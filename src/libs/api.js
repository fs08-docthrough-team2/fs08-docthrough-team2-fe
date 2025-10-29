import axios from 'axios';
import { getAccessToken, isBrowser, clearAccessToken, setAccessToken } from './token.js';
import { useAuthStore } from '@/stores/useAuthStore.js';

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

const isAuthPage = () => {
  return isBrowser && ['/auth/login', '/auth/signup'].includes(window.location.pathname);
};

const goToLoginOnce = () => {
  if (!isBrowser) return;
  if (window.__goingToLogin) return;
  window.__goingToLogin = true;

  if (!isAuthPage()) {
    window.location.href = '/auth/login';
  }
};

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
    const status = error.response?.status;

    if (originalRequest.url?.includes('/token/refresh')) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/token/refresh');
        const newToken = data?.accessToken;
        if (!newToken) {
          throw new Error('Refresh token is not valid');
        }
        setAccessToken(newToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        const refreshStatus = e.response?.status;

        if (refreshStatus === 401 || refreshStatus === 403) {
          clearAccessToken();
          useAuthStore.getState().clearUser();
          goToLoginOnce();
          return Promise.reject(e);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
