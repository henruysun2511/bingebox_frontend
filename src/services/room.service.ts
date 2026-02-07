import { RoomInput } from "@/schemas/room.schema";
import { ApiResponse } from "@/types/body";
import { Room } from "@/types/object";
import { RoomParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "rooms";

export const RoomService = {
    getList(params: RoomParams) {
        return http.get<ApiResponse<Room[]>>(`/${prefix}`, { params });
    },
    getDetail(id: string) {
        return http.get<ApiResponse<Room>>(`/${prefix}/${id}`);
    },
    create(payload: RoomInput) {
        return http.post<ApiResponse<Room>>(`/${prefix}`, payload);
    },
    update(id: string, payload: Partial<RoomInput>) {
        return http.patch<ApiResponse<Room>>(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
};