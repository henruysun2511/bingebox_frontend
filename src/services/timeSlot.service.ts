import { TimeSlotInput } from "@/schemas/timeSlot.schema";
import { ApiResponse } from "@/types/body";
import { TimeSlot } from "@/types/object";
import http from "@/utils/http";

const prefix = "time-slots";

export const TimeSlotService = {
    getList() {
        return http.get<ApiResponse<TimeSlot[]>>(`/${prefix}`);
    },

    create(payload: TimeSlotInput) {
        return http.post<ApiResponse<TimeSlot>>(`/${prefix}`, payload);
    },

    update(id: string, payload: TimeSlotInput) {
        return http.patch<ApiResponse<TimeSlot>>(`/${prefix}/${id}`, payload);
    },

    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};