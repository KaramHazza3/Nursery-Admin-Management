import { z } from "zod";

export const strictObject = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).strict();
