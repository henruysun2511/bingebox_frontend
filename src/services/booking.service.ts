import { ApiResponse } from "@/types/body";
import { Booking, BookingAdmin, BookingDetail } from "@/types/object";
import http from "@/utils/http";


const prefix = "bookings";

export const BookingService = {
  createBooking(data: any) {
    return http.post<ApiResponse<Booking>>(`/${prefix}`, data);
  },

  getMyBookings() {
    return http.get<ApiResponse<Booking[]>>(`/${prefix}/my-booking`);
  },

  getAllBookings(params: any) {
    return http.get<ApiResponse<BookingAdmin[]>>(`/${prefix}`, { params });
  },

  getBookingDetail(id: string) {
    return http.get<ApiResponse<BookingDetail>>(`/${prefix}/${id}`);
  },

  // Cleanup booking lỗi
  cleanup() {
    return http.delete<ApiResponse<void>>(`/${prefix}/cleanup`);
  }
};