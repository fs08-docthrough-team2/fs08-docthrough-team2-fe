'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { setAccessToken } from '@/libs/token';
import api from '@/libs/api';
import Spinner from '@/components/common/Spinner';

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

  return <Spinner isLoading={true} />;
};

export default CallbackPage;
