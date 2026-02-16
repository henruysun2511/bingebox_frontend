import { PermissionMethodTypeEnum } from "@/constants/enum";
import * as zod from "zod";

export const PermissionSchema = zod.object({
    name: zod.string().min(1, "Tên quyền không được để trống"),
    method: zod.enum(Object.values(PermissionMethodTypeEnum)),
    path: zod.string().min(1, "Đường dẫn không được để trống"),
    module: zod.string().min(1, "Module không được để trống"),
    description: zod.string().optional(),
});

export type PermissionInput = zod.infer<typeof PermissionSchema>;