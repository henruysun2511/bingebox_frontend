import { ChangePasswordInput, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "@/schemas/auth.schema";
import { ApiResponse, LoginResponse } from "@/types/body"; // Sửa lại path cho chuẩn
import { User } from "@/types/object";
import { refreshApi } from "@/utils/axios";
import http from "@/utils/http";

const authPrefix = "/auth";

export const authService = {
  register(data: RegisterInput) {
    return http.post<ApiResponse<User>>(`${authPrefix}/register`, data);
  },
  login(data: LoginInput) {
    return http.post<ApiResponse<LoginResponse>>(`${authPrefix}/login`, data);
  },

  logout() {
    return http.post(`${authPrefix}/logout`);
  },

  refreshToken() {
    return refreshApi.post(`${authPrefix}/refresh-token`);
  },
  forgotPassword(data: ForgotPasswordInput) {
    return http.post(`${authPrefix}/forgot-password`, data);
  },

  resetPassword(data: ResetPasswordInput) {
    return http.post(`${authPrefix}/reset-password`, data);
  },

  changePassword(data: ChangePasswordInput) {
    return http.post(`${authPrefix}/change-password`, data);
  },
};