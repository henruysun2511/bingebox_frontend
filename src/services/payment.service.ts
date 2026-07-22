import { Payment } from "@/types/object";
import http from "@/utils/http";

const prefix = "payments";

export const PaymentService = {
    createPayment(bookingId: string) {
        return http.post<Payment>(`/${prefix}`, { bookingId });
    },

    getPaymentStatus(bookingId: string) {
        return http.get<{ paymentStatus: string; bookingStatus: string; referenceCode: string; amount: number }>(`/${prefix}/${bookingId}/status`);
    },

    failPayment(bookingId: string) {
        return http.post(`/${prefix}/fail`, { bookingId });
    },
};
