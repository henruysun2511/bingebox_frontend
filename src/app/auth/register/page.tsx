"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GenderEnum } from "@/constants/enum";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useRegister } from "@/queries/useAuthQuery";
import { RegisterInput, RegisterSchema } from "@/schemas/auth.schema";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const { mutate: registerUser, isPending } = useRegister();

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

    const { uploadFile, isUploading } = useUploadFile();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploaded = await uploadFile(file);
            form.setValue("avatar", uploaded.url, { shouldValidate: true });
            toast.success("Upload ảnh thành công");
        } catch (error) {
            toast.error("Upload ảnh thất bại");
        }
    };

    const onSubmit = (values: RegisterInput) => {
        const cleanValues = removeEmptyFields(values) as RegisterInput;

        registerUser(cleanValues, {
            onSuccess: () => {
                toast.success("Đăng ký thành công!");
                router.push("/auth/login");
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message || "Đăng ký thất bại";
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-end bg-[url('https://henruysun2511.github.io/BingeBox_Project/assets/images/starwarsLogin.jpg')] bg-cover bg-center bg-no-repeat font-['Orbitron',_sans-serif]">

            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <Card className="!w-[450px] bg-gradient border-none backdrop-blur-xl shadow-2xl z-10 p-6 h-screen rounded-none flex flex-col justify-center">
                <CardContent className="flex flex-col items-center">
                    <h2 className="text-[35px] text-white font-bold mb-6 tracking-wider text-center">
                        REGISTER
                    </h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6]" />
                                                <Input placeholder="Username" className="form-input-custom h-11" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6]" />
                                                <Input type="email" placeholder="Email" className="form-input-custom h-11" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6]" />
                                                <Input type="password" placeholder="Password" className="form-input-custom h-11" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Full Name (optional)" className="form-input-custom h-11" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Birth */}
                            <FormField
                                control={form.control}
                                name="birth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6]" />
                                                <Input type="date" className="form-input-custom h-11" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Gender */}
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="form-input-custom h-11 w-full bg-transparent text-white"
                                            >
                                                <option value={GenderEnum.MALE}>Nam</option>
                                                <option value={GenderEnum.FEMALE}>Nữ</option>
                                                <option value={GenderEnum.OTHER}>Khác</option>
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Avatar */}
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

                            <Button
                                type="submit"
                                className="btn-custom !w-full !py-5 mt-2"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "ĐĂNG KÝ"
                                )}
                            </Button>

                            <p className="text-center text-gray-400 text-sm">
                                Đã có tài khoản?
                                <Link href="/auth/login" className="text-red-500 hover:text-red-400 hover:underline font-bold ml-1">
                                    Đăng nhập
                                </Link>
                            </p>
                        </form>

                        <div className="flex items-center justify-center gap-4 pt-10 border-t border-white/10 mt-6">
                            <img
                                src="https://henruysun2511.github.io/BingeBox_Project/assets/images/bingebox_logo.png"
                                alt="Logo"
                                className="w-20 h-auto object-contain brightness-110"
                            />
                            <h3 className="text-white text-xl font-bold leading-tight tracking-[2px]">
                                BINGEBOX<br />CINEMA
                            </h3>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}