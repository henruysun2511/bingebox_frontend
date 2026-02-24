import { VoucherInput } from "@/schemas/voucher.schema";
import { VoucherService } from "@/services/voucher.service";
import { VoucherParams } from "@/types/param";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const VOUCHER_KEY = ["vouchers"];

export const useVoucherList = (params: VoucherParams) => {
    return useQuery({
        queryKey: [...VOUCHER_KEY, params],
        queryFn: () => VoucherService.getList(params).then(res => res.data),
    });
};

export const useCreateVoucher = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: VoucherService.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: VOUCHER_KEY }),
    });
};

export const useUpdateVoucher = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: VoucherInput }) => VoucherService.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: VOUCHER_KEY }),
    });
};

export const useDeleteVoucher = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: VoucherService.delete,
        onSuccess: () => qc.invalidateQueries({ queryKey: VOUCHER_KEY }),
    });
};

export const useChangeVoucherStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            VoucherService.changeStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: VOUCHER_KEY });
        },
    });
};