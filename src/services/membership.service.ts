import { MembershipInput } from "@/schemas/membership.schema";
import { ApiResponse } from "@/types/body";
import { Membership } from "@/types/object";
import http from "@/utils/http";

const prefix = "memberships";

export const MembershipService = {
    getList: () => 
        http.get<ApiResponse<Membership[]>>(`/${prefix}`),
    
    getDetail: (id: string) => 
        http.get<ApiResponse<Membership>>(`/${prefix}/${id}`),
    
    create: (data: MembershipInput) => 
        http.post<ApiResponse<Membership>>(`/${prefix}`, data),
    
    update: (id: string, data: MembershipInput) => 
        http.patch<ApiResponse<Membership>>(`/${prefix}/${id}`, data),
    
    delete: (id: string) => 
        http.delete<ApiResponse<null>>(`/${prefix}/${id}`),
};