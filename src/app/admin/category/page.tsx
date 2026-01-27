"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useCategoryList, useDeleteCategory } from "@/queries/useCategoryQuery";
import { Category } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categoryColumns } from "./category-column";
import { CategoryDialog } from "./category-dialog";

export default function CategoryPage() {

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [selected, setSelected] = useState<Category | undefined>();
    const [open, setOpen] = useState(false);

    const { data, isPending } = useCategoryList();

    const categories = data?.data ?? [];

    const deleteCategory = useDeleteCategory();
    const openConfirm = (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        deleteCategory.mutate(idToDelete, {
            onSuccess: () => {
                toast.success("Xóa danh mục thành công");
                setIsConfirmOpen(false);
                setIdToDelete(null);
            },
            onError: (err: any) => {
                handleError(err);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* FILTER BAR */}
            <div className="flex justify-between items-center">
                <Button className="btn-custom" onClick={() => setOpen(true)}>
                    <Plus size={16} />
                    Thêm thể loại
                </Button>
            </div>


            {/* TABLE */}
            <DataTable
                data={categories}
                columns={categoryColumns(
                    (category) => { setSelected(category); setOpen(true); },
                    (id) => openConfirm(id)
                )}
                loading={isPending}
            />


            {/* MODAL */}
            <CategoryDialog
                open={open}
                category={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteCategory.isPending}
            />
        </div>
    );
}