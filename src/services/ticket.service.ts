import { ApiResponse } from "@/types/body";
import { TicketDetail, TicketUser } from "@/types/object";
import { Pagination } from "@/types/param";
import http from "@/utils/http";

const prefix = "tickets";

export const TicketService = {
    getMyTickets(params: Pagination) {
        return http.get<ApiResponse<TicketUser[]>>(`/${prefix}/my-tickets`, { params });
    },

    getDetail(id: string) {
        return http.get<ApiResponse<TicketDetail>>(`/${prefix}/${id}`);
    },
};