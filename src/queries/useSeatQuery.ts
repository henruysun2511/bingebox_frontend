import { SeatService } from "@/services/seat.service";
import { Seat } from "@/types/object";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SEAT_QUERY_KEY = ["seats"];

export const useSeatListByRoom = (roomId: string) => {
    return useQuery({
        queryKey: [...SEAT_QUERY_KEY, "room", roomId],
        queryFn: async () => {
            const res = await SeatService.getByRoom(roomId);
            return res.data;
        },
        enabled: !!roomId,
    });
};

export const useSeatsByShowtime = (showtimeId: string) => {
    return useQuery({
        queryKey: [...SEAT_QUERY_KEY, "by-showtime", showtimeId],
        queryFn: async () => {
            if (!showtimeId) return null;
            const res = await SeatService.getSeatsByShowtime(showtimeId);
            return res.data;
        },
        enabled: !!showtimeId,

        // Cấu hình quan trọng cho trang đặt vé:
        refetchInterval: 5000, // Tự động cập nhật trạng thái ghế mỗi 5 giây (giả lập real-time)
        staleTime: 0, // Luôn coi dữ liệu là cũ để fetch mới khi quay lại tab
    });
};

// Hook cập nhật ghế theo Room ID
export const useUpdateSeatByRoom = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: { seats: Seat[] } }) =>
            SeatService.updateSeatsByRoom(roomId, data),
        onSuccess: (_, { roomId }) => {
            qc.invalidateQueries({
                queryKey: [...SEAT_QUERY_KEY, "room", roomId]
            });
        },
    });
};