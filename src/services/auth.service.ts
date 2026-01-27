import { ApiResponse, LoginBody, LoginResponse } from "@/types/body"; // Sửa lại path cho chuẩn
import { refreshApi } from "@/utils/axios";
import http from "@/utils/http";

const authPrefix = "/auth";

export const authService = {
  login(data: LoginBody) {
    return http.post<ApiResponse<LoginResponse>>(`${authPrefix}/login`, data);
  },

  logout() {
    return http.post(`${authPrefix}/logout`);
  },

  refreshToken() {
    return refreshApi.post(`${authPrefix}/refresh-token`);
  }
};