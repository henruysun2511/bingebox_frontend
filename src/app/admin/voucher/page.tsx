"use client"

import { DataPagination } from "@/components/admin/pagination/data-pagination"
import { DataTable } from "@/components/admin/table/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"

import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog"
import { useDebounce } from "@/hooks/useDebounce"
import { useChangeVoucherStatus, useDeleteVoucher, useVoucherList } from "@/queries/useVoucherQuery"
import { handleError } from "@/utils/error"
import { toast } from "sonner"
import { voucherColumns } from "./voucher-coulmn"
import { VoucherDialog } from "./voucher-dialog"
import { VoucherFilter } from "./voucher-filter"

export default function VoucherPage() {
    const [filters, setFilters] = useState({
        name: "",
        code: "",
        status: "",
    })

    const [page, setPage] = useState(1)
    const debouncedFilters = useDebounce(filters, 500)

    const { data, isPending } = useVoucherList({
        ...debouncedFilters,
        page,
    })

    const deleteMutation = useDeleteVoucher()

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<any>()
    const [idToDelete, setIdToDelete] = useState<string | null>(null)

    useEffect(() => {
        setPage(1)
    }, [debouncedFilters])

    const changeStatusMutation = useChangeVoucherStatus();

    const handleChangeStatus = async (id: string, status: string) => {
        try {
            await changeStatusMutation.mutateAsync({ id, status });
            toast.success("Cập nhật trạng thái thành công");
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">
                    Voucher
                </h1>

                <Button onClick={() => setOpen(true)} className="btn-custom">
                    <Plus size={18} /> Thêm voucher
                </Button>
            </div>

            <VoucherFilter filters={filters} setFilters={setFilters} />

            <DataTable
                columns={voucherColumns(
                    (v) => { setSelected(v); setOpen(true) },
                    (id) => setIdToDelete(id),
                    handleChangeStatus
                )}
                data={data?.data || []}
                loading={isPending}
            />

            <DataPagination
                page={data?.pagination?.page || 1}
                totalPages={data?.pagination?.totalPages || 1}
                onPageChange={setPage}
            />

            <VoucherDialog
                open={open}
                voucher={selected}
                onClose={() => { setOpen(false); setSelected(undefined) }}
            />

            <ConfirmDialog
                open={!!idToDelete}
                onClose={() => setIdToDelete(null)}
                onConfirm={async () => {
                    await deleteMutation.mutateAsync(idToDelete!)
                    toast.success("Đã xóa voucher")
                    setIdToDelete(null)
                }}
            />
        </div>
    )
}