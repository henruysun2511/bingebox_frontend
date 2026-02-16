"use client";

import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
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
    const [filters, setFilters] = useState({ name: "", path: "", method: "all" });

    const { data, isPending } = usePermissionList(filters);
    const permissions = data?.data || [];
    console.log(permissions)

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

            <div className="space-y-10 mt-8">
                {Object.keys(groupedData).map((module) => (
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
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-blue-500/50 transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                                            p.method === "GET" ? "bg-green-500/20 text-green-400" :
                                                p.method === "POST" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                                        )}>
                                            {p.method}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                            onClick={() => handleEdit(p)}
                                        >
                                            <EditIcon size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            onClick={() => handleDeleteClick(p._id)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                    <h3 className="text-white font-semibold text-sm line-clamp-1">{p.name}</h3>
                                    <code className="text-[11px] text-gray-500 mt-1 block font-mono">{p.path}</code>
                                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 italic">{p.description || "Không có mô tả"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <PermissionDialog open={open} data={selected} onClose={() => setOpen(false)} />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
                title="Xác nhận xóa quyền"
                description="Bạn có chắc chắn muốn xóa quyền hạn này? Hành động này không thể hoàn tác."
            />
        </div>
    );
}

function cn(...classes: any[]) { return classes.filter(Boolean).join(" "); }