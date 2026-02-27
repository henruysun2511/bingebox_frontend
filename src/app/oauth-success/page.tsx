"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    // Lưu accessToken trước
    Cookies.set("accessToken", accessToken, { expires: 7 });

    // Sau đó gọi getMe để lấy user
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
  }, [router, searchParams, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang xử lý đăng nhập Google...
    </div>
  );
}