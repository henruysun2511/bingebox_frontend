import z from "zod/v3";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TimeSlotSchema = z.object({
    name: z.string().min(1, "Tên khung giờ không được để trống"),
    startTime: z.string().regex(timeRegex, "Định dạng HH:mm (VD: 08:00)"),
    endTime: z.string().regex(timeRegex, "Định dạng HH:mm (VD: 12:00)"),
});

export type TimeSlotInput = z.infer<typeof TimeSlotSchema>;