'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/libs/api';
import { getAccessToken } from '@/libs/token';

const AuthBootstrapper = () => {
  const hasRun = useRef(false);
  const isUserLoaded = useAuthStore((state) => state.isUserLoaded);
  const setUser = useAuthStore((state) => state.setUser);
  const markUserLoaded = useAuthStore((state) => state.markUserLoaded);

  useEffect(() => {
    if (hasRun.current || isUserLoaded) return;
    hasRun.current = true;

    const bootstrap = async () => {
      try {
        const token = getAccessToken();

        if (!token) {
          return;
        }

        const res = await api.get('/user/my');
        const user = res.data?.data;

        if (user) setUser(user);
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        markUserLoaded();
      }
    };

    bootstrap();
  }, [isUserLoaded, setUser, markUserLoaded]);

  return null;
};

export default AuthBootstrapper;
