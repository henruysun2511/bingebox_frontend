import { AuthState } from "@/types/state";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrated: false,

  setAuth: (user, token) =>
    set({ user, accessToken: token }),

  setAccessToken: (token) =>
    set({ accessToken: token }),

  logout: () =>
    set({ user: null, accessToken: null }),

  setHydrated: () =>
    set({ isHydrated: true }),
}));