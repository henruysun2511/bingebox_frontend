import { TimeSlotInput } from "@/schemas/timeSlot.schema";
import { TimeSlotService } from "@/services/timeSlot.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TIMESLOT_QUERY_KEY = ["time-slots"];

export const useTimeSlotList = () => {
    return useQuery({
        queryKey: TIMESLOT_QUERY_KEY,
        queryFn: async () => {
            const res = await TimeSlotService.getList();
            return res.data;
        },
    });
};

export const useCreateTimeSlot = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: TimeSlotService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: TIMESLOT_QUERY_KEY }),
    });
};

export const useUpdateTimeSlot = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TimeSlotInput }) =>
            TimeSlotService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: TIMESLOT_QUERY_KEY }),
    });
};

export const useDeleteTimeSlot = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: TimeSlotService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: TIMESLOT_QUERY_KEY }),
    });
};