import { z } from 'zod';

export const createCommentSchema = z.object({
    movie: z.string()
        .length(24, { message: "ID phim phải đủ 24 ký tự" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "ID phim không đúng định dạng hex" }),

    content: z.string()
        .trim()
        .min(1, { message: "Nội dung bình luận không được để trống" })
        .max(500, { message: "Bình luận không được vượt quá 500 ký tự" }),

    rating: z.number()
        .min(1, { message: "Đánh giá thấp nhất là 1 sao" })
        .max(5, { message: "Đánh giá cao nhất là 5 sao" })
        .optional(),

    parent: z.string()
        .length(24, { message: "ID bình luận cha phải đủ 24 ký tự" })
        .regex(/^[0-9a-fA-F]{24}$/, { message: "ID bình luận cha không đúng định dạng hex" })
        .optional()
        .nullable(), 
});
export type CommentInput = z.infer<typeof createCommentSchema>;