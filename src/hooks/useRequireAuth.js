'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore.js';

const useRequireAuth = (redirectTo = '/auth/login') => {
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.authStatus);

  useEffect(() => {
    if (authStatus === 'guest') {
      router.replace(redirectTo);
    }
  }, [authStatus, router, redirectTo]);

  return authStatus;
};

export default useRequireAuth;
