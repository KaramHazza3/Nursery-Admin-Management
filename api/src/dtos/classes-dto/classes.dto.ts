import { ClassSchema, SpecificClassResponseSchema } from "@/schemas";
import { z } from "zod";

export const ClassResponseDto = ClassSchema.omit({createdAt: true, updatedAt: true, childIds: true, nannyIds: true}).extend({
    id: z.string(),
    nanniesNames: z.array(z.string()),
    childrenNumber: z.number(),
});

export const SpecificClassResponseDto = SpecificClassResponseSchema;

export const CreateClassDto = z.object({
  name: z.string().min(1, "Class name is required"),
  nanniesNames: z.array(z.string().min(1)).min(1, "At least one nanny name is required"),
});

export const CreateClassResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  nanniesNames: z.array(z.string()),
});

export const AddChildToClassDto = z.object({
  childName: z.string().min(1, "Child name is required"),
});

export const EditClassDto = z.object({
  name: z.string().min(1, "Class name is required"),
  nanniesNames: z.array(z.string().min(1)).nonempty("At least one nanny name is required"),
});

export const EditClassDtoPartial = EditClassDto.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one of the following fields must be provided: 'name', 'nanniesNames': []",
  }
);
