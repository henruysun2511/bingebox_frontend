import { ApiResponse } from "@/types/body";
import { Seat, SeatType } from "@/types/object";
import http from "@/utils/http";

const prefix = "seats";

export const SeatService = {
    getSeatsByShowtime(showtimeId: string) {
        return http.get<ApiResponse<Seat[]>>(`/${prefix}/showtimes/${showtimeId}`);
    },

    getByRoom(roomId: string) {
        return http.get<ApiResponse<SeatType[]>>(`/${prefix}/rooms/${roomId}`);
    },

    updateSeatsByRoom(roomId: string, payload: { seats: Seat[] }) {
        return http.put<ApiResponse<SeatType[]>>(`/${prefix}/${roomId}`, payload);
    },
};