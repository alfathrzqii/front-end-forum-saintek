import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: 'dummy-token',
  user: {
    id: 'user-1',
    name: 'Dummy User',
    email: 'dummy@example.com',
  },
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  logout: () => set({ token: null, user: null }),
}));

export default useAuthStore;
