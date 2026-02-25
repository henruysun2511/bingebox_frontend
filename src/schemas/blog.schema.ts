import { z } from "zod"

export const BlogSchema = z.object({
    title: z.string().min(1, "Tiêu đề là bắt buộc"),
    slug: z.string().min(1, "Slug là bắt buộc"),
    content: z.string().min(1, "Nội dung là bắt buộc"),
    thumbnail: z.string().optional(),
})

export type BlogInput = z.infer<typeof BlogSchema>