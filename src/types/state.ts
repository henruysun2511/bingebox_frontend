import { LoginResponse } from "./body";

interface AuthState {
  user: Omit<LoginResponse, 'accessToken'> | null; 
  accessToken: string | null;
  isHydrated: boolean;

  setAuth: (user: Omit<LoginResponse, 'accessToken'>, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}
export type { AuthState };

