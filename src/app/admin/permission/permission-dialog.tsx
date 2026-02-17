"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PermissionMethodTypeEnum } from "@/constants/enum";
import { useCreatePermission, useUpdatePermission } from "@/queries/usePermissionQuery";
import { PermissionInput, PermissionSchema } from "@/schemas/permission.schema";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    data?: any; // Dữ liệu permission khi Sửa
}

export function PermissionDialog({ open, onClose, data }: Props) {
    const isEdit = !!data;

    const form = useForm<PermissionInput>({
        resolver: zodResolver(PermissionSchema),
        defaultValues: {
            name: "",
            method: PermissionMethodTypeEnum.GET,
            path: "",
            module: "",
            description: "",
        },
    });

    const createMutation = useCreatePermission();
    const updateMutation = useUpdatePermission();

    // Reset form khi đóng/mở hoặc khi dữ liệu 'data' thay đổi (Sửa)
    useEffect(() => {
        if (open) {
            if (data) {
                form.reset({
                    name: data.name,
                    method: data.method,
                    path: data.path,
                    module: data.module,
                    description: data.description || "",
                });
            } else {
                form.reset({
                    name: "",
                    method: PermissionMethodTypeEnum.GET,
                    path: "",
                    module: "",
                    description: "",
                });
            }
        }
    }, [open, data, form]);

    const onSubmit = async (values: PermissionInput) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: data._id, data: values });
                toast.success("Cập nhật quyền thành công");
            } else {
                await createMutation.mutateAsync(values);
                toast.success("Tạo quyền mới thành công");
            }
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-[700px] bg-neutral-950 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-500">
                        {isEdit ? "Chỉnh sửa quyền hạn" : "Thêm quyền hạn mới"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        {/* Tên quyền */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tên quyền (Ví dụ: Lấy danh sách phim)</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="form-input-custom" placeholder="Nhập tên quyền..." />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Method */}
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Phương thức</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="select-trigger-custom h-11">
                                                    <SelectValue placeholder="Chọn Method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="select-content-custom">
                                                {Object.values(PermissionMethodTypeEnum).map((method) => (
                                                    <SelectItem className="select-item-custom" key={method} value={method}>
                                                        {method}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                            {/* Module */}
                            <FormField
                                control={form.control}
                                name="module"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">Module (Nhóm)</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="form-input-custom" placeholder="Ví dụ: MOVIES" />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Đường dẫn API */}
                        <FormField
                            control={form.control}
                            name="path"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Đường dẫn API (Path)</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="form-input-custom font-mono text-sm" placeholder="/api/v1/..." />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* Mô tả */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Mô tả chi tiết</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="form-input-custom min-h-[80px]"
                                            placeholder="Quyền này dùng để làm gì..."
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* Nút Submit */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full btn-custom h-12 font-bold uppercase tracking-wider"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? "Đang xử lý..."
                                    : isEdit ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}