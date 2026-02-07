"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";

import { useDebounce } from "@/hooks/useDebounce";
import { useChangeRoomStatus, useDeleteRoom, useRoomList } from "@/queries/useRoomQuery";
import { Room } from "@/types/object";
import { handleError } from "@/utils/error";

import { roomColumns } from "./room-column";
import { RoomDialog } from "./room-dialog";
import { RoomFilter } from "./room-filter";

export default function RoomPage() {
    const router = useRouter();
    
    // States cho Filter & Pagination
    const [search, setSearch] = useState("");
    const [cinemaId, setCinemaId] = useState("all");
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search, 500);

    // States cho Dialog (Thêm/Sửa)
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Room | undefined>();

    // States cho Confirm Delete
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    // Fetch Data
    const { data, isPending } = useRoomList({
        page,
        limit: 10,
        name: debouncedSearch,
        cinemaId: cinemaId === "all" ? undefined : cinemaId,
    });
    console.log(data)

    const rooms = data?.data ?? [];
    const pagination = data?.pagination;

    // Mutation
    const deleteRoom = useDeleteRoom();

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteRoom.mutateAsync(idToDelete);
            toast.success("Xóa phòng thành công");
            setIsConfirmOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    const changeStatusMutation = useChangeRoomStatus();

    const handleChangeStatus = async (id: string, status: string) => {
        try {
            await changeStatusMutation.mutateAsync({ id, status });
            toast.success("Cập nhật trạng thái thành công");
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Phòng chiếu</h1>
                <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Thêm Phòng
                </Button>
            </div>

            <RoomFilter
                search={search}
                setSearch={setSearch}
                cinemaId={cinemaId}
                setCinemaId={setCinemaId}
                setPage={setPage}
            />

            <DataTable
                data={rooms}
                columns={roomColumns(
                    (room) => { setSelected(room); setOpen(true); }, // Edit
                    (id) => { setIdToDelete(id); setIsConfirmOpen(true); }, // Delete
                    handleChangeStatus // Change status
                )}
                loading={isPending}
            />

            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            {/* Dialog Thêm/Sửa */}
            <RoomDialog
                open={open}
                room={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            {/* Dialog Xác nhận xóa */}
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteRoom.isPending}
            />
        </div>
    );
}