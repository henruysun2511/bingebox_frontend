import z from "zod";

export const UploadSchema = z.instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "File tối đa 5MB")
  .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), "Chỉ chấp nhận định dạng .jpg, .png, .webp");