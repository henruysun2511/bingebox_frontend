"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteMembership, useMembershipList } from "@/queries/useMembershipQuery";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { membershipColumns } from "./membership-coulmn";
import { MembershipDialog } from "./membership-dialog";

export default function MembershipPage() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(undefined);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data, isPending } = useMembershipList();
    const deleteMutation = useDeleteMembership();

    const handleConfirmDelete = async () => {
        if (idToDelete) {
            await deleteMutation.mutateAsync(idToDelete)
                .then(() => { toast.success("Xóa thành công"); setIdToDelete(null); })
                .catch(err => toast.error(err.message));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Hạng thành viên</h1>
                <Button onClick={() => setOpen(true)} className="btn-custom">
                    <Plus size={18} className="mr-2" /> Thêm hạng
                </Button>
            </div>

            <DataTable
                columns={membershipColumns(
                    (item) => { setSelected(item); setOpen(true); },
                    (id) => setIdToDelete(id)
                )}
                data={data?.data || []}
                loading={isPending}
            />


            <MembershipDialog
                open={open}
                membership={selected}
                onClose={() => { setOpen(false); setSelected(undefined); }}
            />

            <ConfirmDialog
                open={!!idToDelete}
                onClose={() => setIdToDelete(null)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}