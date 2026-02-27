"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingStatusEnum } from "@/constants/enum";
import { useBookingList, useCleanupBooking } from "@/queries/useBookingQuery";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { bookingColumns } from "./booking-column";
import { BookingDetailDialog } from "./booking-detail";


export default function BookingsPage() {
    const [page, setPage] = useState(1);
    // 2. Sử dụng Enum cho state
    const [status, setStatus] = useState<string>("all");
    const limit = 10;

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    // States cho Dialog xem chi tiết
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // 3. Truyền status vào params
    const { data, isPending } = useBookingList({
        page,
        limit,
        status: status === "all" ? undefined : status
    });

    const bookings = data?.data ?? [];
    const pagination = data?.pagination;

    const cleanupBooking = useCleanupBooking();

    const openCleanupDialog = () => {
        setIsConfirmOpen(true);
    };

    const handleConfirmCleanup = async () => {
        cleanupBooking.mutate(undefined, {
            onSuccess: () => {
                toast.success("Đã dọn dẹp các hóa đơn bị hủy");
                setIsConfirmOpen(false);
            },
            onError: (error: any) => {
                toast.error(error.message || "Dọn dẹp thất bại");
                setIsConfirmOpen(false);
            },
        });
    };

    const handleOpenDetail = (id: string) => {
        setSelectedBookingId(id);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-10">
                    <h1 className="text-2xl font-bold text-white">Hóa đơn</h1>

                    <Select value={status} onValueChange={(value) => {
                        setStatus(value);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[180px] select-trigger-custom">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent className="select-content-custom">
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem className="select-item-custom" value={BookingStatusEnum.SUCCESS}>Thành công</SelectItem>
                            <SelectItem className="select-item-custom" value={BookingStatusEnum.PENDING}>Chờ thanh toán</SelectItem>
                            <SelectItem className="select-item-custom" value={BookingStatusEnum.FAILED}>Thất bại</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
                <Button className="bg-red-600 hover:bg-red-700" onClick={openCleanupDialog}>
                    <Trash2 size={16} className="mr-2" /> Dọn dẹp hóa đơn lỗi
                </Button>
            </div>

            {/* TABLE */}
            <DataTable
                data={bookings}
                columns={bookingColumns(
                    (booking) => handleOpenDetail(booking._id)
                )}
                loading={isPending}
            />

            {/* PAGINATION */}
            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            {/* DIALOG XEM CHI TIẾT */}
            <BookingDetailDialog
                open={isDetailOpen}
                bookingId={selectedBookingId}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedBookingId(null);
                }}
            />

            {/* CONFIRM DIALOG XÓA */}
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmCleanup}
                isLoading={cleanupBooking.isPending}
                title="Dọn dẹp hóa đơn lỗi"
                description="Bạn chắc chắn muốn xóa tất cả các hóa đơn lỗi/hết hạn? Hành động này không thể hoàn tác."
            />
        </div>
    );
}