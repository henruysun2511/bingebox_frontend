import * as z from "zod";

export const LoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(50, { message: "Tên đăng nhập quá dài" }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;