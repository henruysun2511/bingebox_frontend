import { AgeTypeInput } from "@/schemas/ageType.schema";
import { ApiResponse } from "@/types/body";
import { AgeType } from "@/types/object";
import { AgeTypeParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "age-types";

export const AgeTypeService = {
  getList: (params: AgeTypeParams) => 
    http.get<ApiResponse<AgeType[]>>(`/${prefix}`, { params }),
    
  create: (data: AgeTypeInput) => 
    http.post<ApiResponse<any>>(`/${prefix}`, data),
    
  update: (id: string, data: AgeTypeInput) => 
    http.patch<ApiResponse<any>>(`/${prefix}/${id}`, data),
    
  delete: (id: string) => 
    http.delete<ApiResponse<null>>(`/${prefix}/${id}`),
};