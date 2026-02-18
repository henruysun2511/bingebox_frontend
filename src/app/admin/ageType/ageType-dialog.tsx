import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAgeType, useUpdateAgeType } from "@/queries/useAgeTypeQuery";
import { AgeTypeInput, AgeTypeSchema } from "@/schemas/ageType.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    ageType?: any;
}

export function AgeTypeDialog({ open, onClose, ageType }: Props) {
    const isEdit = !!ageType;
    const createMutation = useCreateAgeType();
    const updateMutation = useUpdateAgeType();

    const form = useForm<AgeTypeInput>({
        resolver: zodResolver(AgeTypeSchema) as any,
        defaultValues: {
            name: "",
            minAge: 0,
            maxAge: 0,
        },
    });

    useEffect(() => {
        if (ageType && open) {
            form.reset({
                name: ageType.name,
                minAge: ageType.minAge,
                maxAge: ageType.maxAge,
            });
        } else if (!isEdit) {
            form.reset({ name: "", minAge: 0, maxAge: 100 });
        }
    }, [ageType, open, form, isEdit]);

    const onSubmit = (data: AgeTypeInput) => {
        const action = isEdit
            ? updateMutation.mutateAsync({ id: ageType._id, data })
            : createMutation.mutateAsync(data);

        action
            .then(() => {
                toast.success(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
                onClose();
            })
            .catch((err) => toast.error(err.message || "Có lỗi xảy ra"));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chỉnh sửa đối tượng" : "Thêm đối tượng mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đối tượng</FormLabel>
                                    <FormControl><Input {...field} className="form-input-custom" /></FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="minAge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuổi tối thiểu</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="form-input-custom"
                                                {...field}
                                                // Ép kiểu giá trị đầu vào thành số ngay lập tức
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxAge"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tuổi tối đa</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="form-input-custom"
                                                {...field}
                                                // Ép kiểu giá trị đầu vào thành số ngay lập tức
                                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full btn-custom" disabled={createMutation.isPending || updateMutation.isPending}>
                            {isEdit ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}