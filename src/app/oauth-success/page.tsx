"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    Cookies.set("accessToken", accessToken, { expires: 7 });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data.data.user;

        setAuth(
          {
            username: user.username,
            role: user.role,
            avatar: user.avatar,
          },
          accessToken
        );

        router.push("/");
      })
      .catch(() => router.push("/auth/login"));
  }, [router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Đang đăng nhập với Google...
    </div>
  );
}