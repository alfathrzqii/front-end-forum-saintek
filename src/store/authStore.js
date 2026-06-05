import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  setToken: (token) => set({ token }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, refreshToken: null, user: null }),
}));

export default useAuthStore;
