import { ApiResponse } from "@/types/body";
import { User } from "@/types/object";
import { UserParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "users";

export const UserService = {
    getUsers(params: UserParams) {
        return http.get<ApiResponse<User[]>>(`/${prefix}`, { params });
    },
    getMe() {
        return http.get<ApiResponse<User>>(`/${prefix}/me`);
    },
    updateMe(payload: any) {
        return http.patch<ApiResponse<User>>(`/${prefix}/me`, payload);
    },
    assignRole(id: string, roleId: string) {
        return http.patch<ApiResponse<User>>(`/${prefix}/assign-role/${id}`, { roleId });
    },
    toggleBlock(id: string, isBlocked: boolean) {
        return http.patch<ApiResponse<User>>(`/${prefix}/toggle-block/${id}`, { isBlocked });
    },
    redeemPoints(id: string, points: number) {
        return http.patch<ApiResponse<User>>(`/${prefix}/redeem-points/${id}`, { points });
    },
};