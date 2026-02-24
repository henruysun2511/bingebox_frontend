import { z } from "zod"


export const VoucherSchema = z.object({
  name: z.string().trim().min(1, "Tên voucher không được để trống"),

  code: z
    .string()
    .trim()
    .min(1, "Mã code không được để trống")
    .transform((val) => val.toUpperCase()),

  description: z.string().optional(),

  startTime: z.string().min(1, "Ngày bắt đầu là bắt buộc"),

  endTime: z.string().min(1, "Ngày kết thúc là bắt buộc"),

  minOrderValue: z.coerce.number().min(0),
  maxDiscountAmount: z.coerce.number().min(0),
  maxUsage: z.coerce.number().int().min(1),
})
.refine((data) => {
  return new Date(data.endTime) > new Date(data.startTime)
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["endTime"],
})

export type VoucherInput = z.infer<typeof VoucherSchema>