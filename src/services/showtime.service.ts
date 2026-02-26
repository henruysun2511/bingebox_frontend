import { ShowtimeInput } from "@/schemas/showtime.schema";
import { ApiResponse } from "@/types/body";
import { Showtime, ShowtimeCinema, ShowtimeDetail, ShowtimeMovie, ShowtimeRoom } from "@/types/object";
import { ShowtimeParams } from "@/types/param";
import http from "@/utils/http";
import { format } from "date-fns";

const prefix = "showtimes";

export const ShowtimeService = {
    getList(params: ShowtimeParams) {
        return http.get<ApiResponse<Showtime[]>>(`/${prefix}`, { params });
    },
    getDetail(id: string) {
        return http.get<ApiResponse<ShowtimeDetail>>(`/${prefix}/${id}`);
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
        const formattedDate = params.date
            ? format(params.date, "yyyy-MM-dd")
            : undefined;

        return http.get<ApiResponse<ShowtimeMovie[]>>(
            `/${prefix}/movies/${movieId}`,
            {
                params: {
                    ...params,
                    date: formattedDate,
                },
            }
        );
    },
    getShowtimesGroupByRoom(cinemaId: string, params: ShowtimeParams) {
        return http.get<ApiResponse<ShowtimeRoom[]>>(`/${prefix}/cinemas/${cinemaId}/rooms`, { params });
    },

    getShowtimesByCinema(cinemaId: string, date?: Date | string) {
        const formattedDate = date
            ? typeof date === "string"
                ? date
                : format(date, "yyyy-MM-dd")
            : undefined;

        return http.get<ApiResponse<ShowtimeCinema[]>>(
            `/${prefix}/cinemas/${cinemaId}`,
            {
                params: {
                    date: formattedDate,
                },
            }
        );
    },
};