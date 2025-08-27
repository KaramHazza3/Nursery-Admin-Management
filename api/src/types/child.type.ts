import { z } from "zod";
import { ChildSchema } from "@/schemas/child.schema";
import { ChildrenView, ChildResponseDto, ChildShortInfoDto, ChildWithParentResponseDto, CreateChildDto, UpdateChildDto } from "@/dtos/children-dto/children.dto";

export type Child = z.infer<typeof ChildSchema>;
export type CreateChildDto = z.infer<typeof CreateChildDto>;
export type AllChildrenResponse = z.infer<typeof ChildrenView>;
export type ChildResponseDto = z.infer<typeof ChildResponseDto>;
export type ChildWithParentResponseDto = z.infer<typeof ChildWithParentResponseDto>;
export type ChildShortInfoDto = z.infer<typeof ChildShortInfoDto>;
export type UpdateChildDto = z.infer<typeof UpdateChildDto>;