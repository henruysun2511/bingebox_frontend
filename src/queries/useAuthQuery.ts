import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useRefreshTokenQuery() {
  return useQuery({
    queryKey: ["auth-refresh"],
    queryFn: async () => {
      const res = await authService.refreshToken();
      return res.data.data.accessToken as string;
    },
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (res) => {
            const { username, role, avatar, accessToken } = res.data.data;
            setAuth({ username, role, avatar}, accessToken);
        },
    });
}

export function useLogout() {
    const logoutStore = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logoutStore();
            window.location.href = "/";
        },
    });
}