import * as z from "zod";

export const CinemaSchema = z.object({
  name: z.string().min(2, "Tên rạp phải có ít nhất 2 ký tự"),
  location: z.string().min(5, "Địa chỉ phải cụ thể hơn"),
  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
  description: z.string().optional(),
  image: z.string().url("Hình ảnh không hợp lệ").or(z.literal("")),
});

export type CinemaInput = z.infer<typeof CinemaSchema>;