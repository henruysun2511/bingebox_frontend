import { TicketPriceInput } from "@/schemas/ticketPrice.schema";
import { ApiResponse } from "@/types/body";
import { TicketPrice } from "@/types/object";
import { TicketPriceParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "ticket-prices";

export const TicketPriceService = {
    getList(params: TicketPriceParams) {
        return http.get<ApiResponse<TicketPrice[]>>(`/${prefix}`, { params });
    },
    getDetail(id: string) {
        return http.get<ApiResponse<TicketPrice>>(`/${prefix}/${id}`);
    },
    create(payload: TicketPriceInput) {
        return http.post<ApiResponse<TicketPrice>>(`/${prefix}`, payload);
    },
    update(id: string, payload: TicketPriceInput) {
        return http.patch<ApiResponse<TicketPrice>>(`/${prefix}/${id}`, payload);
    },
    delete(id: string) {
        return http.delete<ApiResponse<null>>(`/${prefix}/${id}`);
    },
    previewTicketPrice: (payload: { seatId: string; showtimeId: string }) => {
        return http.post(`/${prefix}/preview`, payload);
    },
};