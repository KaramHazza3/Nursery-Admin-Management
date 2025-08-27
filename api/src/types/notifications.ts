import { notificationsResponseDto, sendNotificationDto } from "@/dtos/notification-dto/notifcation.dto";
import z from "zod";

export type sendNotificationDto = z.infer<typeof sendNotificationDto>;
export type notificationsResponseDto = z.infer<typeof notificationsResponseDto>;