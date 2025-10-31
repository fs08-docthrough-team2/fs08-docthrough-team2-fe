'use client';

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isUserLoaded: false,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  markUserLoaded: () => set({ isUserLoaded: true }),
}));
