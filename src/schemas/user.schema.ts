import { GenderEnum } from "@/constants/enum";
import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(2, "Tên đăng nhập phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(1, "Họ tên không được để trống"),
  avatar: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  birth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  gender: z.nativeEnum(GenderEnum),
  tags: z.array(z.string()).default([]),
});

export type UserInput = z.infer<typeof UserSchema>;