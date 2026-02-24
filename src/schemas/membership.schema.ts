import * as z from "zod";

export const MembershipSchema = z.object({
    name: z.string().trim().min(1, "Tên hạng không được để trống"),
    minSpending: z.coerce.number().min(0, "Chi tiêu tối thiểu không được nhỏ hơn 0"),
    pointAccumulationRate: z.coerce.number()
        .min(0, "Tỷ lệ tích điểm từ 0 đến 1")
        .max(1, "Tỷ lệ tích điểm từ 0 đến 1"),
    discountRate: z.coerce.number()
        .min(0, "Tỷ lệ giảm giá từ 0 đến 1")
        .max(1, "Tỷ lệ giảm giá từ 0 đến 1"),
});

export type MembershipInput = z.infer<typeof MembershipSchema>;