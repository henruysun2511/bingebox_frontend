import { UserJwtPayload } from "@/types/body";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): UserJwtPayload | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<UserJwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000; // Đổi sang giây
  return decoded.exp < currentTime;
};