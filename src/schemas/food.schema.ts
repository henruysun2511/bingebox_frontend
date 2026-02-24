import * as z from "zod";

export const FoodSchema = z.object({
    name: z.string().trim().min(1, "Tên món ăn không được để trống"),
    image: z.string().url("Link ảnh không đúng định dạng"),
    price: z.coerce.number().min(0, "Giá tiền không được nhỏ hơn 0"),
});

export type FoodInput = z.infer<typeof FoodSchema>;