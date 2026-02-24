"use client";
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
import { useUploadFile } from "@/hooks/useUploadFile";
import { useCreateActor, useUpdateActor } from "@/queries/useActorQuery";
import { ActorInput, ActorSchema } from "@/schemas/actor.schema";
import { Actor } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    actor?: Actor;
}

export function ActorDialog({ open, onClose, actor }: Props) {
    const isEdit = !!actor;

    const form = useForm<ActorInput>({
        resolver: zodResolver(ActorSchema),
        defaultValues: {
            name: "",
            avatar: "",
            gender: undefined,
            nationality: "",
            bio: "",
        },
    });

    const { uploadFile, isUploading } = useUploadFile();
    const createActor = useCreateActor();
    const updateActor = useUpdateActor();

    useEffect(() => {
        if (open) {
            if (actor) {
                form.reset({
                    name: actor.name,
                    avatar: actor.avatar,
                    gender: actor.gender,
                    nationality: actor.nationality,
                    bio: actor.bio,
                });
            } else {
                form.reset({
                    name: "",
                    avatar: "",
                    gender: undefined,
                    nationality: "",
                    bio: "",
                });
            }
        }
    }, [open, actor, form]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploaded = await uploadFile(file);
            // Quan trọng: setValue cần triggers validation
            form.setValue("avatar", uploaded.url, { shouldValidate: true });
            toast.success("Upload ảnh thành công");
        } catch (error) {
            toast.error("Upload ảnh thất bại");
        }
    };

    const onSubmit = async (values: ActorInput) => {
        try {
            const cleanValues = removeEmptyFields(values) as ActorInput;

            if (isEdit) {
                await updateActor.mutateAsync({
                    id: actor!._id,
                    data: cleanValues,
                });
                toast.success("Cập nhật actor thành công");
            } else {
                console.log(cleanValues);
                await createActor.mutateAsync(cleanValues);
                toast.success("Thêm actor thành công");
            }
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* max-h-[90vh] và overflow-y-auto giúp dialog không bị tràn màn hình */}
            <DialogContent className="max-w-7xl bg-black text-white overflow-y-auto max-h-[90vh] border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Sửa Actor" : "Thêm Actor"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* TÊN ACTOR */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tên actor</FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Nhập tên diễn viên..." {...field} />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* AVATAR */}
                        <div className="space-y-2">
                            <label className="form-label-custom">Avatar</label>
                            {form.watch("avatar") && (
                                <div className="relative w-28 h-28 mb-2 group">
                                    <img
                                        src={form.watch("avatar")}
                                        alt="Preview"
                                        className="w-full h-full rounded-md object-cover border border-neutral-800 transition-all group-hover:border-blue"
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
                            {form.formState.errors.avatar && (
                                <p className="form-error-custom">{form.formState.errors.avatar.message}</p>
                            )}
                        </div>

                        {/* GENDER */}
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Giới tính</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="select-trigger-custom">
                                                <SelectValue placeholder="Chọn giới tính" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="select-content-custom">
                                            <SelectItem value="male" className="select-item-custom">Nam</SelectItem>
                                            <SelectItem value="female" className="select-item-custom">Nữ</SelectItem>
                                            <SelectItem value="other" className="select-item-custom">Khác</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* QUỐC TỊCH */}
                        <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Quốc tịch</FormLabel>
                                    <FormControl>
                                        <Input className="form-input-custom" placeholder="Ví dụ: Việt Nam, Mỹ..." {...field} />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* TIỂU SỬ */}
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Tiểu sử</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="form-input-custom min-h-[120px] resize-none"
                                            placeholder="Mô tả ngắn về diễn viên..."
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
                                createActor.isPending ||
                                updateActor.isPending
                            }
                        >
                            {isUploading ? "Đang xử lý..." : (isEdit ? "Lưu thay đổi" : "Tạo Actor mới")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}