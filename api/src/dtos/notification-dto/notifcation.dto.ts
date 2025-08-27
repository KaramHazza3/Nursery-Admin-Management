import { strictObject } from "@/utils/strictObject";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";

export const sendNotificationDto = strictObject({
  author: z.string(),
  authorName: z.string(),
  recipients: z.array(z.string()),
  content: z.string(),
  type: z.string(),
  timestamp: z.union([
    z.preprocess(
      (val) =>
        typeof val === "string" || typeof val === "number"
          ? new Date(val)
          : val,
      z.date()
    ),
    z.custom<FieldValue>((val) => val instanceof FieldValue),
  ]),
  sendByAdmin: z.boolean(),
});

export const sendNotificationRequestDto = strictObject({
  childId: z.string(),
  content: z.string(),
});

export const notificationsResponseDto = strictObject({
  date: z.string(),
  parentName: z.string(),
  content: z.string()
});