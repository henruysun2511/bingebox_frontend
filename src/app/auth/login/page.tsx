"use client"

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
import { useLogin } from "@/queries/useAuthQuery";
import { LoginInput, LoginSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
    const router = useRouter();
    const { mutate: login, isPending } = useLogin();

    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginInput) => {
        login(values, {
            onSuccess: () => {
                toast.success("Đăng nhập thành công!");
                router.push("/");
                router.refresh();
            },
            onError: (error: any) => {
                const errorMessage = error?.response?.data?.message || "Đăng nhập thất bại";
                toast.error(errorMessage);
            }
        });
    };


    return (
        <div className="min-h-screen w-full flex items-center justify-end bg-[url('https://henruysun2511.github.io/BingeBox_Project/assets/images/starwarsLogin.jpg')] bg-cover bg-center bg-no-repeat font-['Orbitron',_sans-serif]">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <Card className="!w-[450px] bg-black/60 border-none backdrop-blur-xl shadow-2xl z-10 p-6 h-screen rounded-none flex flex-col justify-center">
                <CardContent className="flex flex-col items-center">
                    <h2 className="text-[35px] text-white font-bold mb-8 tracking-wider text-center">
                        LOGIN
                    </h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">

                            {/* Username */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <div className="relative group">
                                                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6] transition-colors" />
                                                <Input
                                                    placeholder="Username"
                                                    className="form-input-custom h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-[#1c3cd6] transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
                                                    className="form-input-custom h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <Link href="/forgot-password" className="text-xs text-white/60 hover:text-[#1c3cd6] transition-colors underline-offset-4 hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Login button */}
                            <div className="flex justify-center pt-2">
                                <Button
                                    type="submit"
                                    className="btn-custom !w-full !py-5"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        "ĐĂNG NHẬP"
                                    )}
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span className="text-white/40 text-[10px] font-bold">HOẶC</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>

                            {/* Google Login */}
                            <Button
                                type="button"
                                className="rounded-md w-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-3 h-12  font-semibold transition-all"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    className="w-5 h-5"
                                    alt="google"
                                />
                                Google Access
                            </Button>

                            {/* Register */}
                            <p className="text-center text-gray-400 text-sm">
                                Bạn chưa có tài khoản?
                                <Link href="/register" className="text-red-500 hover:text-red-400 hover:underline font-bold ml-1 transition-colors">
                                    Đăng ký
                                </Link>
                            </p>

                            {/* Brand */}
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

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}