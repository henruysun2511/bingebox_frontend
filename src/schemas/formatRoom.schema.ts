import * as z from "zod";

export const FormatRoomSchema = z.object({
  name: z.string().min(1, "Tên định dạng không được để trống"),
  description: z.string().optional(),
  image: z.string().url("Link ảnh không hợp lệ").or(z.literal("")).optional(),
});

export type FormatRoomInput = z.infer<typeof FormatRoomSchema>;