import { FormatRoomInput } from "@/schemas/formatRoom.schema";
import { FormatRoomService } from "@/services/formatRoom.service";
import { FormatRoomParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FORMAT_ROOM_QUERY_KEY = ["format-rooms"];

export const useFormatRoomList = (params: FormatRoomParams) => {
    return useQuery({
        queryKey: [...FORMAT_ROOM_QUERY_KEY, params],
        queryFn: async () => {
            const res = await FormatRoomService.getList(params);
            return res.data;
        },
    });
};

export const useCreateFormatRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: FormatRoomService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: FORMAT_ROOM_QUERY_KEY }),
    });
};

export const useUpdateFormatRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormatRoomInput }) =>
            FormatRoomService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: FORMAT_ROOM_QUERY_KEY }),
    });
};

export const useDeleteFormatRoom = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: FormatRoomService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: FORMAT_ROOM_QUERY_KEY }),
    });
};