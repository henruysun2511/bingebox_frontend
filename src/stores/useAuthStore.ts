import { AuthState } from "@/types/state";
import Cookies from 'js-cookie';
import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,

      setAuth: (user, token) =>
        set({ user, accessToken: token }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      logout: () => {
        set({ user: null, accessToken: null });
        Cookies.remove('accessToken'); // Xóa cookie khi logout
      },

      setHydrated: () =>
        set({ isHydrated: true }),
    }),
    {
      name: "auth-storage", // key trong localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);