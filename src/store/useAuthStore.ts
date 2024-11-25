import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: (email: string) => {
        const id = crypto.randomUUID();
        set({
          user: {
            id,
            name: email.split('@')[0],
            email
          },
          isLoading: false,
          error: null
        });
      },
      logout: () => set({ user: null, isLoading: false, error: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);