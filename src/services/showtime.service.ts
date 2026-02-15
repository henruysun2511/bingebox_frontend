import { ShowtimeInput } from "@/schemas/showtime.schema";
import { ApiResponse } from "@/types/body";
import { Showtime, ShowtimeMovie, ShowtimeRoom } from "@/types/object";
import { ShowtimeParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "showtimes";

export const ShowtimeService = {
    getList(params: ShowtimeParams) {
        return http.get<ApiResponse<Showtime[]>>(`/${prefix}`, { params });
    },
    create(payload: ShowtimeInput) {
        return http.post<ApiResponse<any>>(`/${prefix}`, payload);
    },
    update(id: string, payload: ShowtimeInput) {
        return http.patch<ApiResponse<any>>(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
    getShowtimesByMovie(movieId: string, params: ShowtimeParams) {
        return http.get<ApiResponse<ShowtimeMovie[]>>(`/${prefix}/movies/${movieId}`, { params });
    },
    getShowtimesGroupByRoom(cinemaId: string, params: ShowtimeParams) {
        return http.get<ApiResponse<ShowtimeRoom[]>>(`/${prefix}/cinemas/${cinemaId}/rooms`, { params });
    }
};