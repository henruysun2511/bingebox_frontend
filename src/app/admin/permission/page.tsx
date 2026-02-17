"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Ưu tiên dùng util của dự án
import { useDeletePermission, usePermissionList } from "@/queries/usePermissionQuery";
import { handleError } from "@/utils/error";
import { EditIcon, Lock, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PermissionDialog } from "./permission-dialog";
import { PermissionFilter } from "./permission-filter";

export default function PermissionPage() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(undefined);

    // Thêm page vào filters
    const [filters, setFilters] = useState({
        name: "",
        path: "",
        method: "all",
        page: 1,
        limit: 12 // Bạn có thể tùy chỉnh số lượng card mỗi trang
    });

    const { data, isPending } = usePermissionList(filters);
    const permissions = data?.data || [];
    const pagination = data?.pagination;

    // Logic gom nhóm theo Module
    const groupedData = useMemo(() => {
        return permissions.reduce((acc: any, curr: any) => {
            const moduleName = curr.module;
            if (!acc[moduleName]) acc[moduleName] = [];
            acc[moduleName].push(curr);
            return acc;
        }, {});
    }, [permissions]);

    const handleEdit = (p: any) => {
        setSelected(p);
        setOpen(true);
    };

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const deleteMutation = useDeletePermission();

    const handleDeleteClick = (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteMutation.mutateAsync(idToDelete);
            toast.success("Xóa quyền hạn thành công");
            setIsConfirmOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    // Hàm chuyển trang
    const setPage = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    Quản lý Quyền hạn
                </h1>
                <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Thêm Quyền
                </Button>
            </div>

            <PermissionFilter filters={filters} setFilters={setFilters} />

            <div className="space-y-10 mt-8 min-h-[400px]">
                {Object.keys(groupedData).length > 0 ? (
                    Object.keys(groupedData).map((module) => (
                        <div key={module} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Lock size={18} className="text-blue-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white uppercase tracking-widest">{module}</h2>
                                <div className="h-[1px] flex-1 bg-white/5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupedData[module].map((p: any) => (
                                    <div
                                        key={p._id}
                                        className="bg-white/5 border border-white/10 p-5 rounded-xl hover:border-blue-500/50 transition-all group relative overflow-hidden"
                                    >
                                        {/* Nút Sửa/Xóa nằm ở góc trên bên phải */}
                                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border-none"
                                                onClick={() => handleEdit(p)}
                                            >
                                                <EditIcon size={14} />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-8 w-8 p-0 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border-none"
                                                onClick={() => handleDeleteClick(p._id)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col h-full">
                                            <div className="mb-3">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                                                    p.method === "GET" ? "bg-green-500/20 text-green-400" :
                                                        p.method === "POST" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                                                )}>
                                                    {p.method}
                                                </span>
                                            </div>

                                            <h3 className="text-white font-semibold text-sm line-clamp-1 pr-16">{p.name}</h3>
                                            <code className="text-[11px] text-gray-500 mt-2 block font-mono bg-black/30 p-1 rounded border border-white/5">
                                                {p.path}
                                            </code>
                                            <p className="text-xs text-gray-400 mt-4 line-clamp-2 italic leading-relaxed">
                                                {p.description || "Không có mô tả chi tiết cho quyền này."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    !isPending && <div className="text-center text-gray-500 py-20">Không tìm thấy quyền hạn nào.</div>
                )}
            </div>

            {/* Phân trang */}

            <div className="mt-10">
                <DataPagination
                    page={pagination?.page ?? 1}
                    totalPages={pagination?.totalPages ?? 1}
                    onPageChange={setPage}
                />
            </div>


            <PermissionDialog open={open} data={selected} onClose={() => setOpen(false)} />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
                title="Xác nhận xóa quyền"
                description="Bạn có chắc chắn muốn xóa quyền hạn này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến các vai trò đang sử dụng quyền này."
            />
        </div>
    );
}