import { FoodInput } from "@/schemas/food.schema";
import { ApiResponse } from "@/types/body";
import { Food } from "@/types/object";
import { FoodParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "foods";

export const FoodService = {
    getList: (params: FoodParams) => 
        http.get<ApiResponse<Food[]>>(`/${prefix}`, { params }),
    
    create: (data: FoodInput) => 
        http.post<ApiResponse<Food>>(`/${prefix}`, data),
    
    update: (id: string, data: FoodInput) => 
        http.patch<ApiResponse<Food>>(`/${prefix}/${id}`, data),
    
    delete: (id: string) => 
        http.delete<ApiResponse<null>>(`/${prefix}/${id}`),
};