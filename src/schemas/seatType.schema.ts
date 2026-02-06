import * as z from "zod";

export const SeatTypeSchema = z.object({
  name: z.string().min(1, "Tên loại ghế không được để trống"),
  color: z.string().min(1, "Mã màu không được để trống").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu phải là định dạng HEX (ví dụ: #FF0000)"),
});

export type SeatTypeInput = z.infer<typeof SeatTypeSchema>;