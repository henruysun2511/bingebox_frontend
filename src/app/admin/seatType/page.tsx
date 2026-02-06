"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteSeatType, useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { SeatType } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { seatTypeColumns } from "./seatType-column";
import { SeatTypeDialog } from "./seatType-dialog";

export default function FormatRoomPage() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [selected, setSelected] = useState<SeatType | undefined>();
    const [open, setOpen] = useState(false);

    const { data, isPending } = useSeatTypeList();

    const types = data?.data ?? [];

    const deleteActor = useDeleteSeatType();

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
                    Thêm loại ghế
                </Button>
            </div>


            {/* TABLE */}
            <DataTable
                data={types}
                columns={seatTypeColumns(
                    (type) => { setSelected(type); setOpen(true); },
                    (id) => openConfirm(id)
                )}
                loading={isPending}
            />


            {/* MODAL */}
            <SeatTypeDialog
                open={open}
                seatType={selected}
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