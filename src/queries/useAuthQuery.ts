import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from "@/types/body";
import { decodeToken } from "@/utils/token";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAuthQuery() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const setHydrated = useAuthStore((s) => s.setHydrated);

    return useQuery({
        queryKey: ["auth-refresh"],
        queryFn: async () => {
            try {
                const res = await authService.refreshToken();
                const accessToken = res.data.data.accessToken;

                // Ép kiểu cho payload để lấy đúng field
                const payload = decodeToken(accessToken) as UserJwtDecode;

                if (payload) {
                    setAuth(
                        {
                            username: payload.username,
                            role: payload.role,
                            avatar: payload.avatar
                        },
                        accessToken
                    );
                }
                setHydrated();
                return true;
            } catch (error) {
                setHydrated(); // Vẫn set hydrated để app biết đã check xong auth
                throw error;
            }
        },
        retry: false,
        staleTime: Infinity, // Tránh refresh liên tục
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