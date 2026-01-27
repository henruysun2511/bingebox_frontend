import * as z from "zod";

export const CategorySchema = z.object({
    name: z.string()
        .min(2, { message: "Tên thể loại phải có ít nhất 2 ký tự" })
        .max(50, { message: "Tên thể loại không được quá 50 ký tự" })
        .trim(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;