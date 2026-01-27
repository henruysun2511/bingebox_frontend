import { GenderEnum } from "@/types/enum";
import * as z from "zod";

export const ActorSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  avatar: z.string().url("Avatar không hợp lệ"),
  gender: z.enum(Object.values(GenderEnum)).optional(),
  nationality: z.string().optional(),
  bio: z.string().optional(),
});

export type ActorInput = z.infer<typeof ActorSchema>;