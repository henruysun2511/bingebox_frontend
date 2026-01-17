import { ApiResponse, LoginBody, LoginResponse } from "@/types/body"; // Sửa lại path cho chuẩn
import { refreshApi } from "@/utils/axios";
import http from "@/utils/http";

export const authService = {
  login(data: LoginBody) {
    return http.post<ApiResponse<LoginResponse>>("/auth/login", data);
  },

  logout() {
    return http.post("/auth/logout");
  },

  refreshToken() {
    return refreshApi.post("/auth/refresh-token");
  }
};