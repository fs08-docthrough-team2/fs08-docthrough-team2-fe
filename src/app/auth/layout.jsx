'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthLayout = ({ children }) => {
  const { user, isUserLoaded } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && user) {
      router.push('/');
    }
  }, [isUserLoaded, user, router]);

  return <>{children}</>;
};

export default AuthLayout;
