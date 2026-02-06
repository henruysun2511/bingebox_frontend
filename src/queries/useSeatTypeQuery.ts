import { SeatTypeService } from "@/services/seatType.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SEAT_TYPE_QUERY_KEY = ["seat-types"];

export const useSeatTypeList = () => {
    return useQuery({
        queryKey: [...SEAT_TYPE_QUERY_KEY],
        queryFn: async () => {
            const res = await SeatTypeService.getList();
            return res.data;
        },
    });
};

export const useCreateSeatType = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: SeatTypeService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: SEAT_TYPE_QUERY_KEY }),
    });
};

export const useUpdateSeatType = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            SeatTypeService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: SEAT_TYPE_QUERY_KEY }),
    });
};

export const useDeleteSeatType = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: SeatTypeService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: SEAT_TYPE_QUERY_KEY }),
    });
};