import { TicketService } from "@/services/ticket.service";
import { Pagination } from "@/types/param";
import { useQuery } from "@tanstack/react-query";

export const TICKET_QUERY_KEY = ["tickets"];

export const useMyTickets = (params: Pagination) => {
    return useQuery({
        queryKey: [...TICKET_QUERY_KEY, "my-tickets", params],
        queryFn: async () => {
            const res = await TicketService.getMyTickets(params);
            return res.data;
        },
    });
};

export const useTicketDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: [...TICKET_QUERY_KEY, id],
        queryFn: async () => {
            if (!id) return null;
            const res = await TicketService.getDetail(id);
            return res.data; 
        },
        enabled: !!id, 
    });
};