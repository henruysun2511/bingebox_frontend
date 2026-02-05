import { CinemaInput } from "@/schemas/cinema.schema";
import { ApiResponse } from "@/types/body";
import { Cinema } from "@/types/object";
import { CinemaParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "cinemas";

export const CinemaService = {
    getList(params: CinemaParams) {
        return http.get<ApiResponse<Cinema[]>>(`/${prefix}`, { params });
    },
    getDetail(id: string) {
        return http.get<ApiResponse<Cinema>>(`/${prefix}/${id}`);
    },
    create(payload: CinemaInput) {
        return http.post(`/${prefix}`, payload);
    },
    update(id: string, payload: CinemaInput) {
        return http.patch(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete(`/${prefix}/${id}`);
    }
};