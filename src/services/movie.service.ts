import { CinemaInput } from "@/schemas/cinema.schema";
import { ApiResponse } from "@/types/body";
import { Movie } from "@/types/object";
import { MovieParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "movies";

export const MovieService = {
    getList(params: MovieParams) {
        return http.get<ApiResponse<Movie[]>>(`/${prefix}`, { params });
    },


    getDetail(id: string) {
        return http.get<ApiResponse<Movie>>(`/${prefix}/detail/${id}`);
    },

    create(payload: CinemaInput) {
        return http.post<ApiResponse<Movie>>(`/${prefix}`, payload);
    },

    update(id: string, payload: CinemaInput) {
        return http.patch<ApiResponse<Movie>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};