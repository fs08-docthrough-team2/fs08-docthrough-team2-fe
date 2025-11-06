'use client';

import { useAuthStore } from '@/stores/useAuthStore';

export const useIsMine = () => {
  const myId = useAuthStore((state) => state.user?.userId);
  return (userId) => {
    if (!myId || !userId) return false;
    return String(myId) === String(userId);
  };
};

export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'ADMIN';
};
