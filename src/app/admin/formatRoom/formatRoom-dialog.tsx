import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useCreateFormatRoom, useUpdateFormatRoom } from "@/queries/useFormatRoomQuery";
import { FormatRoomInput, FormatRoomSchema } from "@/schemas/formatRoom.schema";
import { FormatRoom } from "@/types/object";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    formatRoom?: FormatRoom;
}

export function FormatRoomDialog({ open, onClose, formatRoom }: Props) {
    const isEdit = !!formatRoom;
    const form = useForm<FormatRoomInput>({
        resolver: zodResolver(FormatRoomSchema),
        defaultValues: { name: "", description: "", image: "" },
    });

    const { uploadFile, isUploading } = useUploadFile();
    const createMutation = useCreateFormatRoom();
    const updateMutation = useUpdateFormatRoom();

    useEffect(() => {
        if (open) {
            form.reset(formatRoom ? {
                name: formatRoom.name,
                description: formatRoom.description,
                image: formatRoom.image,
            } : { name: "", description: "", image: "" });
        }
    }, [open, formatRoom, form]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const uploaded = await uploadFile(file);
            form.setValue("image", uploaded.url, { shouldValidate: true });
            toast.success("Upload ảnh thành công");
        } catch (error) { toast.error("Upload ảnh thất bại"); }
    };

    const onSubmit = async (values: FormatRoomInput) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: formatRoom!._id, data: values });
                toast.success("Cập nhật thành công");
            } else {
                await createMutation.mutateAsync(values);
                toast.success("Thêm mới thành công");
            }
            onClose();
        } catch (error) { handleError(error); }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-black text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Sửa định dạng" : "Thêm định dạng phòng"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên định dạng</FormLabel>
                                <FormControl><Input className="form-input-custom" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hình ảnh</label>
                            {form.watch("image") && <img src={form.watch("image")} className="w-32 h-20 object-cover rounded border border-neutral-800" />}
                            <Input type="file" onChange={handleFileChange} disabled={isUploading} className="form-input-file-custom" />
                        </div>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl><Textarea className="form-input-custom" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="btn-custom w-full" disabled={isUploading || createMutation.isPending || updateMutation.isPending}>
                         {isUploading ? "Đang xử lý..." : (isEdit ? "Lưu thay đổi" : "Tạo Định dạng mới")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}