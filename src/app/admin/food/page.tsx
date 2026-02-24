"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteFood, useFoodList } from "@/queries/useFoodQuery";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { foodColumns } from "./food-column";
import { FoodDialog } from "./food-dialog";
import { FoodFilter } from "./food-filter";

export default function FoodPage() {
    const [filters, setFilters] = useState({ name: "", minPrice: "", maxPrice: "" });
    const [page, setPage] = useState(1);
    const debouncedFilters = useDebounce(filters, 500);

    const { data, isPending } = useFoodList({ ...debouncedFilters, page });
    const deleteMutation = useDeleteFood();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(undefined);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Quản lý Món ăn</h1>
                <Button onClick={() => setOpen(true)} className="btn-custom"><Plus size={18} /> Thêm món</Button>
            </div>

            <FoodFilter filters={filters} setFilters={setFilters} />

            <DataTable 
                columns={foodColumns((f) => { setSelected(f); setOpen(true); }, (id) => setIdToDelete(id))} 
                data={data?.data || []} 
                loading={isPending} 
            />

            <DataPagination page={data?.pagination?.page || 1} totalPages={data?.pagination?.totalPages || 1} onPageChange={setPage} />

            <FoodDialog open={open} food={selected} onClose={() => { setOpen(false); setSelected(undefined); }} />
            
            <ConfirmDialog 
                open={!!idToDelete} 
                onClose={() => setIdToDelete(null)} 
                onConfirm={async () => {
                    await deleteMutation.mutateAsync(idToDelete!).then(() => toast.success("Đã xóa"));
                    setIdToDelete(null);
                }} 
            />
        </div>
    );
}