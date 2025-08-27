import { z } from "zod";
import { ClassSchema } from "@/schemas/class.schema.ts";
import { AddChildToClassDto, ClassResponseDto, CreateClassDto, CreateClassResponseDto, EditClassDtoPartial, SpecificClassResponseDto } from "@/dtos/classes-dto/classes.dto";

export type ClassModel = z.infer<typeof ClassSchema>;
export type ClassResponseDto = z.infer<typeof ClassResponseDto>;
export type SpecificClassResponseDto = z.infer<typeof SpecificClassResponseDto>;
export type CreateClassDto = z.infer<typeof CreateClassDto>;
export type CreateClassResponseDto = z.infer<typeof CreateClassResponseDto>;
export type AddChildToClassDto = z.infer<typeof AddChildToClassDto>;
export type EditClassDto = z.infer<typeof EditClassDtoPartial>;