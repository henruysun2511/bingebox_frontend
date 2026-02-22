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
import { useResetPassword } from "@/queries/useAuthQuery";
import { ResetPasswordInput, ResetPasswordSchema } from "@/schemas/auth.schema";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { mutate, isPending } = useResetPassword();
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordInput) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Đổi mật khẩu thành công!");
        router.push("/auth/login");
      },
      onError: (error: any) => {
        handleError(error);
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://henruysun2511.github.io/BingeBox_Project/assets/images/starwarsLogin.jpg')] bg-cover bg-center bg-no-repeat font-['Orbitron',_sans-serif]">
     <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>


      <Card className="relative w-full max-w-md bg-gradient border-none shadow-2xl rounded-2xl p-6 z-10">
        <CardContent className="flex flex-col items-center">
          <h2 className="text-[30px] text-white font-bold mb-6 tracking-wider">
            ĐẶT LẠI MẬT KHẨU
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-500" />
                        <Input
                          placeholder="Email"
                          className="form-input-custom h-11"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* OTP */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-500" />
                        <Input
                          placeholder="OTP (6 digits)"
                          className="form-input-custom h-11"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 group-focus-within:text-blue-500" />
                        <Input
                          type="password"
                          placeholder="New Password"
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
                    Đang xử lý...
                  </>
                ) : (
                  "ĐẶT LẠI MẬT KHẨU"
                )}
              </Button>

              <p className="text-center text-gray-400 text-sm">
                Về trang
                <Link
                  href="/auth/login"
                  className="text-red-500 hover:text-red-400 hover:underline font-bold ml-1"
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