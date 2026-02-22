import { DayOfWeekEnum } from "@/constants/enum";
import * as z from "zod";

export const TicketPriceSchema = z.object({
    timeSlot: z
        .string()
        .min(1, { message: "Vui lòng chọn khung giờ" }),

    ageType: z
        .string()
        .min(1, { message: "Vui lòng chọn loại độ tuổi" }),

    formatRoom: z
        .string()
        .min(1, { message: "Vui lòng chọn định dạng phòng" }),

    seatType: z
        .string()
        .min(1, { message: "Vui lòng chọn loại ghế" }),

    dayOfWeek: z
        .nativeEnum(DayOfWeekEnum)
        .refine((val) => val !== undefined, {
            message: "Ngày trong tuần không hợp lệ",
        }),

    finalPrice: z.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined) {
                return undefined;
            }
            return Number(val);
        },
        z
            .number()
            .min(0, { message: "Giá vé không được nhỏ hơn 0" })
            .max(10000000, { message: "Giá vé quá lớn" })
    ),
});

export type TicketPriceInput = z.infer<typeof TicketPriceSchema>;