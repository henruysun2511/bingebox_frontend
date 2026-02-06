import * as z from "zod";

export const RoomSchema = z.object({
  name: z.string().min(1, "Tên phòng không được để trống"),
  cinema: z.string().length(24, "ID rạp không hợp lệ"),
  format: z.string().length(24, "ID định dạng không hợp lệ"),
});

export type RoomInput = z.infer<typeof RoomSchema>;