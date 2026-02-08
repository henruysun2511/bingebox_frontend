import * as z from "zod";


export const ShowtimeSchema = z.object({
    movie: z.string().min(1, "Phim là bắt buộc"),
    room: z.string().min(1, "Phòng chiếu là bắt buộc"),
    startTime: z.string().min(1, "Giờ bắt đầu là bắt buộc"), 
});

export type ShowtimeInput = z.infer<typeof ShowtimeSchema>;