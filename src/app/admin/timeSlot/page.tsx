"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTimeSlot, useTimeSlotList } from "@/queries/useTimeSlotQuery";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { timeSlotColumns } from "./timeSlot-column";
import { TimeSlotDialog } from "./timeSlot-dialog";

export default function TimeSlotPage() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(undefined);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data, isPending } = useTimeSlotList();
    const deleteMutation = useDeleteTimeSlot();

    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await deleteMutation.mutateAsync(idToDelete);
            toast.success("Đã xóa khung giờ");
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Khung giờ</h1>
                <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Thêm khung giờ
                </Button>
            </div>

            <DataTable
                loading={isPending}
                data={data?.data || []}
                columns={timeSlotColumns(
                    (item) => { setSelected(item); setOpen(true); },
                    (id) => { setIdToDelete(id); setIsConfirmOpen(true); }
                )}
            />

            <TimeSlotDialog open={open} onClose={() => setOpen(false)} data={selected} />
            
            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}