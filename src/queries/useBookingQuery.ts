import { BookingService } from "@/services/booking.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BOOKING_QUERY_KEY = ["bookings"];

// 1. Tạo mới booking
export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: BookingService.createBooking,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
    },
  });
};

// 2. Lấy booking của tôi (User)
export const useMyBookings = () => {
  return useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "my"],
    queryFn: async () => {
      const res = await BookingService.getMyBookings();
      return res.data;
    },
  });
};

// 3. Lấy toàn bộ booking (Admin)
export const useBookingList = (params?: any) => {
  return useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "all", params],
    queryFn: async () => {
      const res = await BookingService.getAllBookings(params);
      return res.data;
    },
  });
};

// 4. Chi tiết booking
export const useBookingDetail = (id?: string) => {
  return useQuery({
    queryKey: [...BOOKING_QUERY_KEY, "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await BookingService.getBookingDetail(id);
      return res.data;
    },
    enabled: !!id,
    staleTime: 0, // Đảm bảo dữ liệu thanh toán luôn mới nhất
  });
};

// 5. Giả lập thanh toán thành công
export const useFakePay = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingService.fakePay(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
    },
  });
};

// 6. Giả lập thanh toán thất bại
export const useFakeFail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingService.fakeFail(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
    },
  });
};

// 7. Dọn dẹp các booking hết hạn/lỗi
export const useCleanupBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: BookingService.cleanup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKING_QUERY_KEY });
    },
  });
};