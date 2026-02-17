import { RoleInput } from "@/schemas/role.schema";
import { ApiResponse } from '@/types/body';
import { Role } from "@/types/object";
import { RoleParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "/roles";

export const RoleService = {
  getList: (params: RoleParams) => 
    http.get<ApiResponse<Role[]>>(`${prefix}`, { params }),

  getDetail: (id: string) => 
    http.get<ApiResponse<Role>>(`${prefix}/${id}`),

  create: (data: RoleInput) => 
    http.post<ApiResponse<any>>(`${prefix}`, data),

  update: (id: string, data: RoleInput) => 
    http.patch<ApiResponse<any>>(`${prefix}/${id}`, data),

  delete: (id: string) => 
    http.delete<ApiResponse<null>>(`${prefix}/${id}`),
};