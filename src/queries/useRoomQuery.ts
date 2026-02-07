import { RoomInput } from "@/schemas/room.schema";
import { RoomService } from "@/services/room.service";
import { RoomParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ROOM_QUERY_KEY = ["rooms"];

export const useRoomList = (params: RoomParams) => {
    return useQuery({
        queryKey: [...ROOM_QUERY_KEY, params],
        queryFn: async () => {
            const res = await RoomService.getList(params);
            return res.data;
        },
    });
};

export const useCreateRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: RoomService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: ROOM_QUERY_KEY }),
    });
};

export const useUpdateRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RoomInput> }) =>
            RoomService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ROOM_QUERY_KEY }),
    });
};

export const useDeleteRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: RoomService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: ROOM_QUERY_KEY }),
    });
};