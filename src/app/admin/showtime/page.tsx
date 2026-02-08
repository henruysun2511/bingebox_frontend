"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteShowtime, useShowtimeList } from "@/queries/useShowtimeQuery";
import { Showtime } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { showtimeColumns } from "./showtime-column";
import { ShowtimeDialog } from "./showtime-dialog";
import { ShowtimeFilter } from "./showtime-filter";


export default function ShowtimePage() {
    const [page, setPage] = useState(1);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Showtime | undefined>();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        date: undefined as Date | undefined,
        movieId: "all",
        roomId: "all",
        cinemaId: "all",
        status: "all"
    });


    const { data, isPending } = useShowtimeList({
        page,
        limit: 10,
        date: filters.date ? filters.date : undefined,
        movieId: filters.movieId !== "all" ? filters.movieId : undefined,
        roomId: filters.roomId !== "all" ? filters.roomId : undefined,
        status: filters.status !== "all" ? filters.status : undefined,
    });

    const showtimes = data?.data ?? [];
    const pagination = data?.pagination;

    const deleteShowtime = useDeleteShowtime();

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteShowtime.mutateAsync(idToDelete);
            toast.success("Xóa lịch chiếu thành công");
            setIsConfirmOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Lịch chiếu</h1>
                <Button className="btn-custom" onClick={() => setOpen(true)}>
                    <Plus size={16} className="mr-2" /> Thêm Lịch chiếu
                </Button>
            </div>

            <ShowtimeFilter
                filters={filters}
                setFilters={setFilters}
                setPage={setPage}
            />

            <DataTable
                loading={isPending}
                columns={showtimeColumns(
                    (showtime) => { setSelected(showtime); setOpen(true); },
                    (id) => { setIdToDelete(id); setIsConfirmOpen(true); },
                )}
                data={showtimes || []}
            />

            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            <ShowtimeDialog
                open={open}
                showtime={selected} // selected sẽ là dữ liệu khi Sửa, undefined khi Thêm
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined); // QUAN TRỌNG: Phải reset state này về undefined
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteShowtime.isPending}
            />
        </div>
    );
}