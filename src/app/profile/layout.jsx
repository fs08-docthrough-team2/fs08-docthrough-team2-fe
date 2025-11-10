'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfileLayout = ({ children }) => {
  const { user, isUserLoaded } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && !user) {
      router.replace('/');
    }
  }, [isUserLoaded, user, router]);

  return <>{children}</>;
};

export default ProfileLayout;
