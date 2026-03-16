import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => void;
  checkAuth: () => boolean;
  updateBalance: (newBalance: number) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const result = await userAPI.login(email, password);
          if (result.success) {
            localStorage.setItem('token', result.token);
            set({ 
              user: result.user, 
              token: result.token,
              isAuthenticated: true 
            });
          }
          return result;
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          // Using fetch directly since userAPI doesn't have register
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
          });
          const result = await response.json();
          
          if (result.success) {
            localStorage.setItem('token', result.token);
            set({ 
              user: result.user, 
              token: result.token,
              isAuthenticated: true 
            });
          }
          return result;
        } catch (error: any) {
          return { success: false, message: error.message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const { token, isAuthenticated } = get();
        return !!token && isAuthenticated;
      },

      updateBalance: (newBalance: number) => {
        set((state) => ({
          user: state.user ? { ...state.user, balance: newBalance } : null
        }));
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);