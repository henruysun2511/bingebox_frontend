import * as z from "zod";

export const RoleSchema = z.object({
  name: z.string().min(1, "Tên role không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  permissions: z.array(z.string()).min(1, "Chọn ít nhất một quyền"),
});

export type RoleInput = z.infer<typeof RoleSchema>;