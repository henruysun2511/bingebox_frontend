import * as z from "zod";

export const AgeTypeSchema = z.object({
  name: z.string().trim().min(1, "Tên đối tượng không được để trống"),
  // Sử dụng coerce để ép kiểu từ string sang number
  minAge: z.coerce.number().min(0, "Tuổi tối thiểu không được nhỏ hơn 0"),
  maxAge: z.coerce.number().min(0, "Tuổi tối đa không được nhỏ hơn 0"),
}).refine((data) => data.maxAge >= data.minAge, {
  message: "Tuổi tối đa phải lớn hơn hoặc bằng tuổi tối thiểu",
  path: ["maxAge"],
});

// Chỗ này cực kỳ quan trọng để sửa lỗi 'unknown'
export type AgeTypeInput = z.infer<typeof AgeTypeSchema>;