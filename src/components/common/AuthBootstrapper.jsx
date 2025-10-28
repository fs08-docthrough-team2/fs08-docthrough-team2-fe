'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AuthBootstrapper = () => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  return null;
};

export default AuthBootstrapper;
