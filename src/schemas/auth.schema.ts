import { GenderEnum } from "@/constants/enum";
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

export const RegisterSchema = z.object({
  username: z.string()
    .trim()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự"),

  email: z.string()
    .email("Email không hợp lệ")
    .transform((val) => val.toLowerCase()),

  password: z.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

  fullName: z.string()
    .trim()
    .max(100, "Họ tên tối đa 100 ký tự")
    .optional()
    .default(""),

  avatar: z.string()
    .url("Avatar phải là URL hợp lệ")
    .optional()
    .default(""),

  birth: z.string()
    .min(1, "Vui lòng cung cấp ngày sinh"),

  gender: z.nativeEnum(GenderEnum).default(GenderEnum.OTHER),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"),

  otp: z
    .string()
    .length(6, "OTP phải có đúng 6 ký tự")
    .min(1, "OTP không được để trống"),

  newPassword: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;


export const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự"),

    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),

    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

