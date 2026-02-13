import { ShowtimeInput } from "@/schemas/showtime.schema";
import { ShowtimeService } from "@/services/showtime.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SHOWTIME_QUERY_KEY = ["showtimes"];

export const useShowtimeList = (params: any) => {
    return useQuery({
        queryKey: [...SHOWTIME_QUERY_KEY, params],
        queryFn: async () => {
            const res = await ShowtimeService.getList(params);
            return res.data;
        },
    });
};

export const useCreateShowtime = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ShowtimeService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEY }),
    });
};

export const useUpdateShowtime = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ShowtimeInput }) =>
            ShowtimeService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEY }),
    });
};

export const useDeleteShowtime = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ShowtimeService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: SHOWTIME_QUERY_KEY }),
    });
};

export const useShowtimesByMovie = (movieId: string, params: any) => {
    return useQuery({
        queryKey: [...SHOWTIME_QUERY_KEY, "by-movie", movieId],
        queryFn: async () => {
            const res = await ShowtimeService.getShowtimesByMovie(movieId, params);
            return res.data;
        },
        enabled: !!movieId, // Chỉ chạy khi có movieId
    });
};

export const useShowtimesGroupByRoom = (cinemaId: string, params: any) => {
    return useQuery({
        queryKey: [...SHOWTIME_QUERY_KEY, "group-by-room", cinemaId, params],
        queryFn: async () => {
            const res = await ShowtimeService.getShowtimesGroupByRoom(cinemaId, params);
            return res.data;
        },
        enabled: !!cinemaId, // Chỉ chạy khi có cinemaId
    });
};