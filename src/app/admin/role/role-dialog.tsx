"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissionList } from "@/queries/usePermissionQuery";
import { useCreateRole, useUpdateRole } from "@/queries/useRoleQuery";
import { RoleInput, RoleSchema } from "@/schemas/role.schema";
import { Role } from "@/types/object";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    role?: Role;
}

export function RoleDialog({ open, onClose, role }: Props) {
    const isEdit = !!role;

    // 1. Quản lý state page cho Permission
    const [permissionPage, setPermissionPage] = useState(1);
    const permissionLimit = 10; // Số lượng permission mỗi trang trong dialog

    // 2. Gọi API với params phân trang
    const { data: permissionRes, isPending: isPermissionLoading } = usePermissionList({
        page: permissionPage,
        limit: permissionLimit
    });

    const permissions = permissionRes?.data || [];
    const pagination = permissionRes?.pagination;

    const createRole = useCreateRole();
    const updateRole = useUpdateRole();

    const form = useForm<RoleInput>({
        resolver: zodResolver(RoleSchema),
        defaultValues: { name: "", description: "", permissions: [] },
    });

    // Reset page và form khi đóng/mở dialog
    useEffect(() => {
        if (open) {
            setPermissionPage(1); // Luôn về trang 1 khi mở
            if (role) {
                form.reset({
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions.map((p: any) => p._id),
                });
            } else {
                form.reset({ name: "", description: "", permissions: [] });
            }
        }
    }, [role, open, form]);

    const onSubmit = (data: RoleInput) => {
        const action = isEdit
            ? updateRole.mutateAsync({ id: role._id!, data })
            : createRole.mutateAsync(data);

        action
            .then(() => {
                toast.success(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
                onClose();
            })
            .catch((err) => toast.error(err.message));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-neutral-900 text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-blue-500">
                        {isEdit ? "Chỉnh sửa Role" : "Thêm Role mới"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên Role</FormLabel>
                                        <FormControl><Input {...field} className="form-input-custom" placeholder="Ví dụ: Admin" /></FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl><Input {...field} className="form-input-custom" placeholder="Mô tả chức năng..." /></FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                        <FormItem className="space-y-3">
                            <FormLabel>Danh sách quyền ({form.getValues("permissions").length} đã chọn)</FormLabel>
                            <ScrollArea className="h-[280px] border border-neutral-800 rounded-md p-4 bg-black/20">
                                {isPermissionLoading ? (
                                    <div className="flex items-center justify-center h-full text-sm text-neutral-500">Đang tải...</div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {permissions.map((p: any) => (
                                            <FormField
                                                key={p._id}
                                                control={form.control}
                                                name="permissions"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(p._id)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValues = field.value || [];
                                                                    return checked
                                                                        ? field.onChange([...currentValues, p._id])
                                                                        : field.onChange(currentValues.filter((val) => val !== p._id));
                                                                }}
                                                                className="checkbox-custom"
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="text-xs font-medium cursor-pointer">
                                                                {p.name}
                                                                <span className={`ml-2 text-[10px] px-1 rounded ${p.method === 'GET' ? 'text-green-500 bg-green-500/10' : 'text-blue-500 bg-blue-500/10'
                                                                    }`}>
                                                                    {p.method}
                                                                </span>
                                                            </FormLabel>
                                                            <p className="text-[10px] text-neutral-500 font-mono line-clamp-1">{p.path}</p>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>

                            {/* 3. Tích hợp Pagination cho Permissions */}

                            <div className="pt-2 border-t border-neutral-800">
                                <DataPagination
                                    page={permissionPage ?? 1}
                                    totalPages={pagination?.totalPages ?? 1}
                                    onPageChange={setPermissionPage}
                                />
                            </div>

                            <FormMessage className="form-error-custom" />
                        </FormItem>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="submit"
                                className="btn-custom min-w-[120px]"
                                disabled={createRole.isPending || updateRole.isPending}
                            >
                                {createRole.isPending || updateRole.isPending ? "Đang xử lý..." : isEdit ? "Cập nhật Role" : "Tạo Role mới"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}