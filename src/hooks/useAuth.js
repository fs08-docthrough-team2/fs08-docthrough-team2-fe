'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/common/Sonner';
import { setAccessToken, clearAccessToken } from '@/libs/token.js';
import api from '@/libs/api.js';

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

      showToast({
        kind: 'success',
        title: '로그인 성공',
      });
      router.push('/');
    } catch (error) {
      showToast({
        kind: 'error',
        title: '로그인 실패',
      });
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

      showToast({
        kind: 'success',
        title: '회원가입 성공',
      });
      router.push('/');
    } catch (error) {
      showToast({
        kind: 'error',
        title: '회원가입 실패',
      });
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
      showToast({
        kind: 'success',
        title: '로그아웃 성공',
      });
      router.push('/');
    } catch (error) {
      showToast({
        kind: 'error',
        title: '로그아웃 실패',
      });
    }
  };

  return { logout };
};
