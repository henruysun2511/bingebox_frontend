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

import { useUploadFile } from "@/hooks/useUploadFile";
import { useCreateFood, useUpdateFood } from "@/queries/useFoodQuery";
import { FoodInput, FoodSchema } from "@/schemas/food.schema";
import { Food } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    food?: Food;
}

export function FoodDialog({ open, onClose, food }: Props) {
    const isEdit = !!food;

    const form = useForm<FoodInput>({
        resolver: zodResolver(FoodSchema) as any,
        defaultValues: {
            name: "",
            image: "",
            price: 0,
        },
    });

    const { uploadFile, isUploading } = useUploadFile();
    const createFood = useCreateFood();
    const updateFood = useUpdateFood();

    useEffect(() => {
        if (open) {
            if (food) {
                form.reset({
                    name: food.name,
                    image: food.image,
                    price: food.price,
                });
            } else {
                form.reset({
                    name: "",
                    image: "",
                    price: 0,
                });
            }
        }
    }, [open, food, form]);

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploaded = await uploadFile(file);
            form.setValue("image", uploaded.url, {
                shouldValidate: true,
            });
            toast.success("Upload ảnh thành công");
        } catch (error) {
            toast.error("Upload ảnh thất bại");
        }
    };

    const onSubmit = async (values: FoodInput) => {
        try {
            const cleanValues = removeEmptyFields(values) as FoodInput;

            if (isEdit) {
                await updateFood.mutateAsync({
                    id: food!._id,
                    data: cleanValues,
                });
                toast.success("Cập nhật món ăn thành công");
            } else {
                await createFood.mutateAsync(cleanValues);
                toast.success("Thêm món ăn thành công");
            }

            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl bg-black text-white overflow-y-auto max-h-[90vh] border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Sửa món ăn" : "Thêm món ăn"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {/* TÊN MÓN */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">
                                        Tên món ăn
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input-custom"
                                            placeholder="Nhập tên món..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* IMAGE */}
                        <div className="space-y-2">
                            <label className="form-label-custom">
                                Hình ảnh
                            </label>

                            {form.watch("image") && (
                                <div className="relative w-28 h-28 mb-2 group">
                                    <img
                                        src={form.watch("image")}
                                        alt="Preview"
                                        className="w-full h-full rounded-md object-cover border border-neutral-800"
                                    />
                                </div>
                            )}

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="form-input-file-custom"
                            />

                            {form.formState.errors.image && (
                                <p className="form-error-custom">
                                    {form.formState.errors.image.message}
                                </p>
                            )}
                        </div>

                        {/* PRICE */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">
                                        Giá bán (VNĐ)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="form-input-custom"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.valueAsNumber || 0
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            className="btn-custom w-full mt-2"
                            disabled={
                                isUploading ||
                                createFood.isPending ||
                                updateFood.isPending
                            }
                        >
                            {isUploading
                                ? "Đang xử lý..."
                                : isEdit
                                ? "Lưu thay đổi"
                                : "Tạo món ăn mới"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}