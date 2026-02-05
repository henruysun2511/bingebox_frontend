import { CinemaInput } from "@/schemas/cinema.schema";
import { CinemaService } from "@/services/cinema.service";
import { CinemaParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CINEMA_QUERY_KEY = ["cinemas"];

export const useCinemaList = (params: CinemaParams) => {
    return useQuery({
        queryKey: [...CINEMA_QUERY_KEY, params],
        queryFn: () => CinemaService.getList(params).then(res => res.data),
    });
};

export const useCinemaDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: [...CINEMA_QUERY_KEY, id],
        queryFn: async () => {
            if (!id) return null;
            const res = await CinemaService.getDetail(id); 
            return res.data;
        },
        enabled: !!id, 
    });
};

export const useCreateCinema = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CinemaService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: CINEMA_QUERY_KEY }),
    });
};

export const useUpdateCinema = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CinemaInput }) => CinemaService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: CINEMA_QUERY_KEY }),
    });
};

export const useDeleteCinema = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: CinemaService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: CINEMA_QUERY_KEY }),
    });
};

