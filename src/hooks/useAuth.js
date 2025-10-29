'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/libs/api.js';
import { setAccessToken, clearAccessToken } from '@/libs/token.js';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const login = async ({ email, password }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.accessToken;
      const user = res.data?.user;

      if (token) {
        setAccessToken(token);
      }
      if (user) {
        setUser(user);
      }

      router.push('/');
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return { login };
};

export const useSignup = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const signup = async ({ email, nickName, password }) => {
    try {
      const res = await api.post('/auth/signup', { email, nickName, password });
      const token = res.data?.accessToken;

      if (token) {
        setAccessToken(token);
      }

      const userRes = await api.get('/user/my');
      const user = userRes.data;

      if (user) {
        setUser(user);
      }

      router.push('/');
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return { signup };
};

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      clearAccessToken();
      clearUser();
      router.push('/');
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return { logout };
};
