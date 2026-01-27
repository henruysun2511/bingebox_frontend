"use client";

import { useRefreshTokenQuery } from "@/queries/useAuthQuery";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserJwtDecode } from "@/types/body";
import { decodeToken } from "@/utils/token";
import { useEffect } from "react";


export function AuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const { data: accessToken, error, isLoading } = useRefreshTokenQuery();

  useEffect(() => {
    if (isLoading) return;

    if (accessToken) {
      const payload = decodeToken(accessToken) as UserJwtDecode;

      setAuth(
        {
          username: payload.username,
          role: payload.role,
          avatar: payload.avatar,
        },
        accessToken
      );
    }

    // Dù success hay fail -> app biết auth đã check xong
    setHydrated();
  }, [isLoading, accessToken, setAuth, setHydrated]);

  return null;
}