import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';
import { loginUser, registerUser, logoutUser, signInWithGoogle } from '../lib/authService';

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        loading: false 
      }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Initialize auth listener
      initializeAuth: () => {
        const auth = getFirebaseAuth();
        if (!auth) {
          set({ loading: false, error: 'Firebase not configured' });
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          set({ 
            user: user ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            } : null,
            isAuthenticated: !!user,
            loading: false 
          });
        });

        return unsubscribe;
      },

      // Login action
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const credential = await loginUser(email, password);
          const user = credential.user;
          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            },
            isAuthenticated: true,
            loading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error };
        }
      },

      // Register action
      register: async (email, password, name) => {
        set({ loading: true, error: null });
        try {
          const credential = await registerUser(email, password);
          const user = credential.user;
          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: name || user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            },
            isAuthenticated: true,
            loading: false,
            error: null 
          });
          return { success: true, user: credential.user };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error };
        }
      },

      // Google sign in
      signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const credential = await signInWithGoogle();
          const user = credential.user;
          set({ 
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified
            },
            isAuthenticated: true,
            loading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error };
        }
      },

      // Logout action
      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logoutUser();
          set({ 
            user: null, 
            isAuthenticated: false,
            loading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error };
        }
      },

      // Clear user (for manual logout)
      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        loading: false 
      }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // only persist user and isAuthenticated
    }
  )
);

export default useAuthStore;
