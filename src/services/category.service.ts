import { ApiResponse } from "@/types/body";
import { Category } from "@/types/object";
import http from "@/utils/http";

const prefix = "categories";

export const CategoryService = {
    getList() {
        return http.get<ApiResponse<Category[]>>(`/${prefix}`);
    },

    create(payload: { name: string }) {
        return http.post<ApiResponse<Category>>(`/${prefix}`, payload);
    },

    update(id: string, payload: { name: string }) {
        return http.patch<ApiResponse<Category>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};