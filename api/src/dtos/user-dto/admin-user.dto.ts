import { AdminUserSchema } from "@/schemas";
import {z} from "zod";

export const CreateAdminRequestDto = AdminUserSchema.omit({
  email: true,
}).extend({
  username: z.string()
});

export const CreateAdminDto = AdminUserSchema.omit({ password: true });

export const CreateAdminResponseDto = AdminUserSchema.omit({ password: true });