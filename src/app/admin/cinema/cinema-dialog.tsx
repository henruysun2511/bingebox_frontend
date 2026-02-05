
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROVINCES } from "@/constants/province";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useCreateCinema, useUpdateCinema } from "@/queries/useCinemaQuery";
import { CinemaInput, CinemaSchema } from "@/schemas/cinema.schema";
import { Cinema } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


interface Props {
    open: boolean;
    onClose: () => void;
    cinema?: Cinema;
}

export function CinemaDialog({ open, onClose, cinema }: Props) {
    const isEdit = !!cinema;

    const form = useForm<CinemaInput>({
        resolver: zodResolver(CinemaSchema),
        defaultValues: {
            name: "",
            location: "",
            province: "",
            description: "",
            image: "",
        },
    });

    const { uploadFile, isUploading } = useUploadFile();
    const createCinema = useCreateCinema();
    const updateCinema = useUpdateCinema();

    // Reset form khi đóng/mở tương tự ActorDialog
    useEffect(() => {
        if (open) {
            if (cinema) {
                form.reset({
                    name: cinema.name,
                    location: cinema.location,
                    province: cinema.province,
                    description: cinema.description || "",
                    image: cinema.image || "",
                });
            } else {
                form.reset({
                    name: "",
                    location: "",
                    province: "",
                    description: "",
                    image: "",
                });
            }
        }
    }, [open, cinema, form]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploaded = await uploadFile(file);
            // Cập nhật vào field "image" của form
            form.setValue("image", uploaded.url, { shouldValidate: true });
            toast.success("Upload ảnh thành công");
        } catch (error) {
            toast.error("Upload ảnh thất bại");
        }
    };

    const onSubmit = async (values: CinemaInput) => {
        try {
            const cleanValues = removeEmptyFields(values) as CinemaInput;

            if (isEdit) {
                await updateCinema.mutateAsync({
                    id: cinema!._id,
                    data: cleanValues,
                });
                toast.success("Cập nhật rạp thành công");
            } else {
                await createCinema.mutateAsync(cleanValues);
                toast.success("Thêm rạp mới thành công");
            }
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl bg-black text-white overflow-y-auto max-h-[90vh] border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Sửa thông tin rạp" : "Thêm rạp chiếu mới"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* TÊN RẠP */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tên rạp</FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ví dụ: CGV Vincom..." {...field} />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* TỈNH THÀNH */}
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tỉnh/Thành phố</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="select-trigger-custom">
                                                <SelectValue placeholder="Chọn tỉnh thành" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="select-content-custom max-h-[250px]">
                                            {PROVINCES.map((p) => (
                                                <SelectItem key={p} value={p} className="select-item-custom">
                                                    {p}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* ĐỊA CHỈ CHI TIẾT */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Địa chỉ chi tiết</FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Số nhà, tên đường..." {...field} />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* HÌNH ẢNH RẠP */}
                        <div className="space-y-2">
                            <label className="form-label-custom">Hình ảnh rạp</label>
                            {form.watch("image") && (
                                <div className="relative w-full h-48 mb-2 group">
                                    <img
                                        src={form.watch("image")}
                                        alt="Preview"
                                        className="w-full h-full rounded-md object-cover border border-neutral-800 transition-all group-hover:border-blue-500"
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
                                <p className="form-error-custom">{form.formState.errors.image.message}</p>
                            )}
                        </div>

                        {/* MÔ TẢ */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Mô tả/Giới thiệu</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="form-input-custom min-h-[120px] resize-none"
                                            placeholder="Giới thiệu về rạp..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* NÚT SUBMIT */}
                        <Button
                            type="submit"
                            className="btn-custom w-full mt-2"
                            disabled={
                                isUploading ||
                                createCinema.isPending ||
                                updateCinema.isPending
                            }
                        >
                            {isUploading ? "Đang xử lý ảnh..." : (isEdit ? "Lưu thay đổi" : "Tạo rạp mới")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
