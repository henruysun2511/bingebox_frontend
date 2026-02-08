import { ApiResponse } from "@/types/body";
import { Seat, SeatType } from "@/types/object"; // Đảm bảo bạn đã export SeatType trong object.ts
import http from "@/utils/http";

const prefix = "seats";

export const SeatService = {
    // GET: /seats/rooms/:id - Lấy danh sách ghế theo roomId
    getByRoom(roomId: string) {
        return http.get<ApiResponse<SeatType[]>>(`/${prefix}/rooms/${roomId}`);
    },

    // PUT: /seats/:roomId - Cập nhật thông tin ghế (ví dụ update sơ đồ hoặc trạng thái)
    updateSeatsByRoom(roomId: string, payload: { seats: Seat[] }) {
        return http.put<ApiResponse<SeatType[]>>(`/${prefix}/${roomId}`, payload);
    },
};