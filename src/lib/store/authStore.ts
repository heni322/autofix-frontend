import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, accessToken) => {
        // Update Zustand state
        set({ user, accessToken, isAuthenticated: true });
        
        // Also update localStorage directly for redundancy
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        
        // Clean up localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
        }
      },

      updateUser: (userData) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null;
          
          // Update localStorage as well
          if (typeof window !== 'undefined' && updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          return { user: updatedUser };
        });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated after rehydration
        state?.setHydrated();
      },
    }
  )
);

// Initialize the store on client side
if (typeof window !== 'undefined') {
  // Force rehydration check
  const checkAuth = () => {
    const store = useAuthStore.getState();
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    // If we have token in localStorage but not in store, restore it
    if (token && userStr && !store.accessToken) {
      try {
        const user = JSON.parse(userStr);
        store.setAuth(user, token);
      } catch (error) {
        console.error('Failed to restore auth from localStorage:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
  };
  
  // Check on load and after hydration
  setTimeout(checkAuth, 0);
}
