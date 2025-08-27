import { strictObject, z } from "zod";

export const NotificationSchema = strictObject({
  author: z.string(),
  authorImage: z.string().optional(),
  authorName: z.string(),
  content: z.string(),
  recipients: z.array(z.string()),
  timestamp: z.date(),
  type: z.string(),
});
