
import { TicketPriceParams } from "@/types/param";

import { TicketPriceInput } from "@/schemas/ticketPrice.schema";
import { TicketPriceService } from "@/services/ticketPrice.service";
import { handleError } from "@/utils/error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TICKET_PRICE_KEY = ["ticket-prices"];

export const useTicketPriceList = (params: TicketPriceParams) => {
    return useQuery({
        queryKey: [...TICKET_PRICE_KEY, params],
        queryFn: () => TicketPriceService.getList(params).then(res => res.data),
    });
};

export const useCreateTicketPrice = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: TicketPriceService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TICKET_PRICE_KEY });
        },
        onError: (error) => handleError(error)
    });
};

export const useUpdateTicketPrice = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TicketPriceInput }) => 
            TicketPriceService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TICKET_PRICE_KEY });
        },
        onError: (error) => handleError(error)
    });
};

export const useDeleteTicketPrice = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: TicketPriceService.delete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TICKET_PRICE_KEY });
        },
        onError: (error) => handleError(error)
    });
};