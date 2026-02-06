import { FormatRoomInput } from "@/schemas/formatRoom.schema";
import { ApiResponse } from "@/types/body";
import { FormatRoom } from "@/types/object";
import { FormatRoomParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "format-rooms"; 

export const FormatRoomService = {
    getList(params: FormatRoomParams) {
        return http.get<ApiResponse<FormatRoom[]>>(`/${prefix}`, { params });
    },
    getDetail(id: string) {
        return http.get<ApiResponse<FormatRoom>>(`/${prefix}/${id}`);
    },
    create(payload: FormatRoomInput) {
        return http.post<ApiResponse<FormatRoom>>(`/${prefix}`, payload);
    },
    update(id: string, payload: FormatRoomInput) {
        return http.patch<ApiResponse<FormatRoom>>(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};