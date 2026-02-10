import { BaseStatusEnum } from "@/constants/enum";
import { z } from "zod";

export const SettingSchema = z.object({
  logo: z.string().min(1, "Logo không được để trống"),
  name: z.string().min(1, "Tên website không được để trống"),
  company: z.string().min(1, "Tên công ty không được để trống"),
  email: z.string().email("Email không đúng định dạng"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  hotline: z.string().min(1, "Số hotline không được để trống"),

  workHours: z.string(),

  social: z.object({
    facebook: z.string().url("Link Facebook không hợp lệ").or(z.literal("")),
    instagram: z.string().url("Link Instagram không hợp lệ").or(z.literal("")),
    tiktok: z.string().url("Link Tiktok không hợp lệ").or(z.literal("")),
    zalo: z.string(),
  }),

  banner: z.array(
    z.object({
      image: z.string().min(1, "Ảnh banner là bắt buộc"),
      link: z.string().url("Link không hợp lệ").or(z.literal("")),
      isActive: z.nativeEnum(BaseStatusEnum),
    })
  ),

  popup: z.array(
    z.object({
      image: z.string().min(1, "Ảnh popup là bắt buộc"),
      link: z.string().url("Link không hợp lệ").or(z.literal("")),
      isActive: z.nativeEnum(BaseStatusEnum),
    })
  ),

  metaTitle: z.string().max(70).or(z.literal("")),
  metaDescription: z.string().max(160).or(z.literal("")),
});

export type SettingInput = z.infer<typeof SettingSchema>;