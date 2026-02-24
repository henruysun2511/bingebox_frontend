import { VoucherInput } from "@/schemas/voucher.schema";
import { ApiResponse } from "@/types/body";
import { Voucher } from "@/types/object";
import { VoucherParams } from "@/types/param";
import http from "@/utils/http";

const prefix = "vouchers";

export const VoucherService = {
    getList: (params: VoucherParams) => http.get<ApiResponse<Voucher[]>>(`/${prefix}`, { params }),
    getDetail: (id: string) => http.get<ApiResponse<Voucher>>(`/${prefix}/${id}`),
    create: (data: VoucherInput) => http.post<ApiResponse<Voucher>>(`/${prefix}`, data),
    update: (id: string, data: VoucherInput) => http.patch<ApiResponse<Voucher>>(`/${prefix}/${id}`, data),
    delete: (id: string) => http.delete<ApiResponse<null>>(`/${prefix}/${id}`),
    changeStatus(id: string, status: string) {
        return http.patch<ApiResponse<Voucher>>(`/${prefix}/change-status/${id}`, { status });
    },
};