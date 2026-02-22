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
import { useForgotPassword } from "@/queries/useAuthQuery";
import { ForgotPasswordInput, ForgotPasswordSchema } from "@/schemas/auth.schema";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const { mutate, isPending } = useForgotPassword();
    const router = useRouter();

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: ForgotPasswordInput) => {
        mutate(values, {
            onSuccess: () => {
                toast.success("OTP đã được gửi về email của bạn");
                router.push("/auth/resetPassword");
            },
            onError: (error: any) => {
                handleError(error);
            },
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[url('https://henruysun2511.github.io/BingeBox_Project/assets/images/starwarsLogin.jpg')] bg-cover bg-center bg-no-repeat font-['Orbitron',_sans-serif]">
            <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <Card className="relative w-full max-w-md bg-gradient shadow-2xl rounded-2xl p-6 z-10 border-none">
                <CardContent className="flex flex-col items-center">
                    <h2 className="text-[30px] text-white font-bold mb-6 tracking-wider">
                        QUÊN MẬT KHẨU
                    </h2>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-5"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-500" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="form-input-custom h-11"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="btn-custom !w-full !py-5"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Đang gửi email...
                                    </>
                                ) : (
                                    "GỬI OTP"
                                )}
                            </Button>

                            <p className="text-center text-gray-400 text-sm">
                                Nhớ mật khẩu rồi?
                                <Link
                                    href="/auth/login"
                                    className="text-red-500 hover:text-red-400 hover:underline ml-1"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </form>
                    </Form>

                    <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/10 mt-6 w-full">
                        <img
                            src="https://henruysun2511.github.io/BingeBox_Project/assets/images/bingebox_logo.png"
                            alt="Logo"
                            className="w-16 brightness-110"
                        />
                        <h3 className="text-white text-lg font-bold tracking-[2px]">
                            BINGEBOX CINEMA
                        </h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}