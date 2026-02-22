"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GenderEnum } from "@/constants/enum";
import { useRegister } from "@/queries/useAuthQuery";
import { RegisterInput, RegisterSchema } from "@/schemas/auth.schema";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function UserDialog({ open, onClose }: Props) {
    const createMutation = useRegister();
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            fullName: "",
            avatar: "",
            birth: "",
            gender: GenderEnum.OTHER,
        },
    });

    const onSubmit = (values: RegisterInput) => {
        const cleanValues = removeEmptyFields(values) as RegisterInput;

        createMutation.mutate(cleanValues, {
            onSuccess: () => {
                toast.success("Tạo người dùng thành công");
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>Thêm người dùng</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Họ tên" {...field} className="form-input-custom" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="date" {...field} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <select {...field} className="form-input-custom w-full">
                                            <option value={GenderEnum.MALE}>Nam</option>
                                            <option value={GenderEnum.FEMALE}>Nữ</option>
                                            <option value={GenderEnum.OTHER}>Khác</option>
                                        </select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Upload Avatar */}
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-col gap-3">
                                            {preview && (
                                                <img
                                                    src={preview}
                                                    className="w-20 h-20 rounded-full object-cover border"
                                                />
                                            )}

                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="form-input-custom"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const localUrl = URL.createObjectURL(file);
                                                    setPreview(localUrl);

                                                    const formData = new FormData();
                                                    formData.append("file", file);

                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: formData,
                                                    });

                                                    const data = await res.json();
                                                    field.onChange(data.url);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="btn-custom w-full"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    "Tạo người dùng"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}