import { SeatService } from "@/services/seat.service";
import { Seat } from "@/types/object";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SEAT_QUERY_KEY = ["seats"];

// Hook lấy danh sách ghế theo Room ID
export const useSeatListByRoom = (roomId: string) => {
    return useQuery({
        queryKey: [...SEAT_QUERY_KEY, "room", roomId],
        queryFn: async () => {
            const res = await SeatService.getByRoom(roomId);
            return res.data;
        },
        enabled: !!roomId, // Chỉ chạy khi có roomId
    });
};

// Hook cập nhật ghế theo Room ID
export const useUpdateSeatByRoom = () => {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: ({ roomId, data }: { roomId: string; data: {seats: Seat[]} }) =>
            SeatService.updateSeatsByRoom(roomId, data),
        onSuccess: (_, { roomId }) => {
            // Invalidate dữ liệu của đúng phòng đó để fetch lại
            qc.invalidateQueries({ 
                queryKey: [...SEAT_QUERY_KEY, "room", roomId] 
            });
        },
    });
};