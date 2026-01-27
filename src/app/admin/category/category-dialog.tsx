import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCategory, useUpdateCategory } from "@/queries/useCategoryQuery";
import { CategoryInput, CategorySchema } from "@/schemas/category.schema";
import { Category } from "@/types/object";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    category?: Category;
}

export function CategoryDialog({ open, onClose, category }: Props) {
    const isEdit = !!category;

    const form = useForm<CategoryInput>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
        },
    });

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();

    useEffect(() => {
        if (open) {
            if (category) {
                form.reset({ name: category.name });
            } else {
                form.reset({ name: "" });
            }
        }
    }, [open, category, form]);

    const onSubmit = async (values: CategoryInput) => {
        try {
            if (isEdit) {
                await updateCategory.mutateAsync({
                    id: category!._id,
                    data: values,
                });
                toast.success("Cập nhật thể loại thành công");
            } else {
                await createCategory.mutateAsync(values);
                toast.success("Thêm thể loại thành công");
            }
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-black text-white border-neutral-800 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Sửa Thể Loại" : "Thêm Thể Loại"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tên thể loại</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className="form-input-custom" 
                                            placeholder="Ví dụ: Hành động, Viễn tưởng..." 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="btn-custom w-full"
                            disabled={createCategory.isPending || updateCategory.isPending}
                        >
                            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}