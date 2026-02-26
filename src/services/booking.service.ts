import { ApiResponse } from "@/types/body";
import { Booking, BookingDetail } from "@/types/object";
import http from "@/utils/http";


const prefix = "bookings";

export const BookingService = {
  createBooking(data: any) {
    return http.post<ApiResponse<Booking>>(`/${prefix}`, data);
  },

  getMyBookings() {
    return http.get<ApiResponse<Booking[]>>(`/${prefix}/my-booking`);
  },

  getAllBookings() {
    return http.get<ApiResponse<Booking[]>>(`/${prefix}`);
  },

  getBookingDetail(id: string) {
    return http.get<ApiResponse<BookingDetail>>(`/${prefix}/${id}`);
  },

  fakePay(id: string) {
    return http.post<ApiResponse<Booking>>(
      `/${prefix}/fake-pay/${id}`
    );
  },

  fakeFail(id: string) {
    return http.post<ApiResponse<Booking>>(
      `/${prefix}/fake-fail/${id}`
    );
  },

  // Cleanup booking lỗi
  cleanup() {
    return http.delete<ApiResponse<void>>(`/${prefix}/cleanup`);
  }
};