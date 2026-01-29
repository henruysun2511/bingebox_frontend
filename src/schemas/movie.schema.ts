import * as z from "zod";

export const MovieSchema = z.object({
  name: z.string().trim().min(1, "Tên phim không được để trống"),
  duration: z.coerce.number().min(1, "Thời lượng phải lớn hơn 0"), 
  releaseDate: z.string().min(1, "Ngày phát hành là bắt buộc"),
  director: z.string().optional().default(""), 
  description: z.string().min(1, "Mô tả phim là bắt buộc"),
  subtitle: z.string().min(1, "Loại phụ đề là bắt buộc"),
  poster: z.string().url("Link poster không hợp lệ"),
  banner: z.string().url("Link banner không hợp lệ"),
  trailer: z.string().url("Link trailer không hợp lệ"),
  actors: z.array(z.string()).min(1, "Phải có ít nhất một diễn viên"),
  categories: z.array(z.string()).min(1, "Phải có ít nhất một thể loại"),
  nationality: z.string().optional().default(""),
  agePermission: z.string().min(1, "Độ tuổi cho phép không hợp lệ"),
  status: z.string().optional().default("active"),
  format: z.array(z.string()).optional().default([]),
});

export type MovieInput = z.input<typeof MovieSchema>;