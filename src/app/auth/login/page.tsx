"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/queries/useAuthQuery";
import { LoginInput, LoginSchema } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginForm() {
    const router = useRouter();
    const { mutate: login, isPending } = useLogin();

    //Khởi tạo Form
    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    //Hàm xử lý submit
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
        <Card className="w-[400px] shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
                <CardDescription className="text-center">
                    Nhập tài khoản của bạn để truy cập hệ thống
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="admin" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" placeholder="••••••" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                "Đăng nhập"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}