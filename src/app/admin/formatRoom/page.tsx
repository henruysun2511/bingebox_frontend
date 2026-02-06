"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteFormatRoom, useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { FormatRoom } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatRoomColumns } from "./formatRoom-column";
import { FormatRoomDialog } from "./formatRoom-dialog";

export default function FormatRoomPage() {
    const [page, setPage] = useState(1);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [selected, setSelected] = useState<FormatRoom | undefined>();
    const [open, setOpen] = useState(false);

    const { data, isPending } = useFormatRoomList({});

    const formats = data?.data ?? [];
    const pagination = data?.pagination;

    const deleteActor = useDeleteFormatRoom();

    const openConfirm = (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        deleteActor.mutate(idToDelete, {
            onSuccess: () => {
                toast.success("Xóa diễn viên thành công");
                setIsConfirmOpen(false);
                setIdToDelete(null);
            },
            onError: (error: any) => {
                handleError(error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* FILTER BAR */}
            <div className="flex justify-between items-center">
                <Button className="btn-custom" onClick={() => setOpen(true)}>
                    <Plus size={16} />
                    Thêm định dạng phòng
                </Button>
            </div>


            {/* TABLE */}
            <DataTable
                data={formats}
                columns={formatRoomColumns(
                    (format) => { setSelected(format); setOpen(true); },
                    (id) => openConfirm(id)
                )}
                loading={isPending}
            />

            {/* PAGINATION */}
            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            {/* MODAL */}
            <FormatRoomDialog
                open={open}
                formatRoom={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteActor.isPending}
            />
        </div>
    );
}