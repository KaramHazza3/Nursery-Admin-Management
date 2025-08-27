import { strictObject, z } from "zod";

export const ClassSchema = strictObject({
  name: z.string(),
  childIds: z.array(z.string()),
  nannyIds: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ChildResponseSchema = strictObject({
  uid: z.string(),
  fullName: z.string(),
  gender: z.string(),
  age: z.number(),
});

export const SpecificClassResponseSchema = ClassSchema.omit({
  childIds: true,
  nannyIds: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  id: z.string(),
  nanniesNames: z.array(z.string()),
  children: z.array(ChildResponseSchema),
});