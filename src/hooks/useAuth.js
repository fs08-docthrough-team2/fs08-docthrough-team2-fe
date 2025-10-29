'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/libs/api';
import { setAccessToken } from '@/libs/token';

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
