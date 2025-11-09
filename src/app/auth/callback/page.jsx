'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';
import api from '@/libs/api';
import { setAccessToken } from '@/libs/token';

const CallbackPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const init = async () => {
      try {
        const tokenRes = await api.post('/token/refresh');
        const accessToken = tokenRes.data?.data?.accessToken;
        if (accessToken) setAccessToken(accessToken);

        const meRes = await api.get('/user/my');
        const user = meRes.data?.data?.user;

        if (user) setUser(user);
        router.replace('/');
      } catch {
        router.replace('/auth/login');
      }
    };
    init();
  }, [router, setUser]);

  return null;
};

export default CallbackPage;
