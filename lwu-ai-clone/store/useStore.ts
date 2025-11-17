import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Creation } from '@/types';

interface StoreState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Creations
  creations: Creation[];

  // UI state
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateCredits: (amount: number) => void;
  addCreation: (creation: Creation) => void;
  getCreations: () => Creation[];
  setLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      creations: [],
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check localStorage for existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      register: async (email, password, name) => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find((u: any) => u.email === email);

        if (existingUser) {
          set({ isLoading: false });
          return false;
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          password,
          credits: 10, // Free tier starts with 10 credits
          plan: 'free',
          createdAt: new Date(),
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const { password: _, ...userWithoutPassword } = newUser;
        set({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, creations: [] });
      },

      updateCredits: (amount) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, credits: user.credits + amount };
          set({ user: updatedUser });

          // Update in localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], credits: updatedUser.credits };
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      },

      addCreation: (creation) => {
        set((state) => ({ creations: [creation, ...state.creations] }));
      },

      getCreations: () => {
        return get().creations;
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'lwu-ai-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        creations: state.creations,
      }),
    }
  )
);
