import { SeatTypeInput } from "@/schemas/seatType.schema";
import { ApiResponse } from "@/types/body";
import { SeatType } from "@/types/object";
import http from "@/utils/http";

const prefix = "seat-types";

export const SeatTypeService = {
    getList() {
        return http.get<ApiResponse<SeatType[]>>(`/${prefix}`);
    },
    create(payload: SeatTypeInput) {
        return http.post<ApiResponse<SeatType>>(`/${prefix}`, payload);
    },
    update(id: string, payload: SeatTypeInput) {
        return http.patch<ApiResponse<SeatType>>(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};