import { PermissionInput } from "@/schemas/permission.schema";
import { ApiResponse } from "@/types/body";
import { Permission } from "@/types/object";
import { PermissionParams } from "@/types/param";
import { removeEmptyFields } from "@/utils/form";
import http from "@/utils/http";

const prefix = "permissions";

export const PermissionService = {
    getList: (params: PermissionParams) => {
        const cleanParams = { ...params };
        if (cleanParams.method === "all") delete cleanParams.method;
        
        // Loại bỏ các trường null, undefined, ""
        const finalParams = removeEmptyFields(cleanParams);
        
        return http.get<ApiResponse<Permission[]>>(`/${prefix}`, { params: finalParams });
    },
    create: (data: PermissionInput) => 
        http.post<ApiResponse<any>>(`/${prefix}`, data),
    
    update: (id: string, data: PermissionInput) => 
        http.patch<ApiResponse<any>>(`/${prefix}/${id}`, data),
    
    delete: (id: string) => 
        http.delete<ApiResponse<null>>(`/${prefix}/${id}`),
};