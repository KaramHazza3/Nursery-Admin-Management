import { ChildSchema, ParentUserSchema, ParentWithChildrenSchema } from "@/schemas";
import { z } from "zod";

export const CreateParentUserWithChildrenDto = ParentWithChildrenSchema;
export const CreateParentUserDto = ParentUserSchema;

export const ViewParentUserResponseDto = ParentUserSchema.omit({
  email: true,
  address: true,
  createdAt: true,
  updatedAt: true,
  role: true,
  linkedChildren: true,
  emergencyContacts: true,
  father: true,
  mother: true,
}).extend({
  fullName: z.string(),
  mobile: z.string(),
  numOfChildren: z.number(),
});

export const ParentUserResponseDto = ParentUserSchema.omit({
  emergencyContacts: true,
  linkedChildren: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  children: z.array(
    z.object({
      fullName: z.string(),
      age: z.number(),
    })
  ),
});

export const UpdateParentDto = ParentUserSchema
  .extend({
    mother: ParentUserSchema.shape.mother.partial().optional(),
    father: ParentUserSchema.shape.father.partial().optional(),
    children: z.array(ChildSchema).optional(),
  })
  .partial();