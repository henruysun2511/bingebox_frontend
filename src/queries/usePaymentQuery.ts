import { PaymentService } from "@/services/payment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PAYMENT_QUERY_KEY = ["payments"];

export const useCreatePayment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bookingId: string) => PaymentService.createPayment(bookingId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PAYMENT_QUERY_KEY });
        },
    });
};

export const usePaymentStatus = (bookingId: string | undefined, refetchInterval?: number) => {
    return useQuery({
        queryKey: [...PAYMENT_QUERY_KEY, "status", bookingId],
        queryFn: async () => {
            if (!bookingId) return null;
            const res = await PaymentService.getPaymentStatus(bookingId);
            return res.data;
        },
        enabled: !!bookingId,
        refetchInterval: refetchInterval ?? false,
    });
};

export const useFailPayment = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (bookingId: string) => PaymentService.failPayment(bookingId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PAYMENT_QUERY_KEY });
        },
    });
};
