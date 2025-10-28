import { create } from 'zustand';
import { clearAccessToken } from '@/libs/token';
import api from '@/libs/api';

export const useAuthStore = create((set) => ({
  authStatus: 'checking',
  user: null,

  setGuest: () => set({ authStatus: 'guest', user: null }),
  setAuthenticated: (user) => set({ authStatus: 'authenticated', user }),

  checkAuthStatus: async () => {
    try {
      const me = await api.get('/user/my');
      set({ authStatus: 'authenticated', user: me.data });
    } catch {
      set({ authStatus: 'guest', user: null });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    clearAccessToken();
    set({ authStatus: 'guest', user: null });
  },
}));
