import { ChildSchema, ParentUserSchema, UpdateChildSchema } from "@/schemas";
import { z } from "zod";

export const CreateChildDto = ChildSchema;
export const ChildrenView = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});

export const ChildResponseDto = ChildSchema;

export const ChildWithParentResponseDto = ChildSchema.extend({
  parent: ParentUserSchema,
});

export const ChildShortInfoDto = z.object({
  id: z.string(),
  fullName: z.string(),
  gender: z.string(),
  age: z.number(),
});

export const UpdateChildDto = UpdateChildSchema;