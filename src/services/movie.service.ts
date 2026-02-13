import { MovieInput } from "@/schemas/movie.schema";
import { ApiResponse } from "@/types/body";
import { Movie } from "@/types/object";
import { MovieParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "movies";

export const MovieService = {
    getList(params: MovieParams) {
        return http.get<ApiResponse<Movie[]>>(`/${prefix}`, { params });
    },
    getAdminList(params: MovieParams) {
        return http.get<ApiResponse<Movie[]>>(`/${prefix}/admin`, { params });
    },

    getActors(movieId: string) {
        return http.get<ApiResponse<any[]>>(`/${prefix}/actors/${movieId}`);
    },

    getDetail(id: string) {
        return http.get<ApiResponse<Movie>>(`/${prefix}/${id}`);
    },

    create(payload: MovieInput) {
        return http.post<ApiResponse<Movie>>(`/${prefix}`, payload);
    },

    update(id: string, payload: MovieInput) {
        return http.patch<ApiResponse<Movie>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};