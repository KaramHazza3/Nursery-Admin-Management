import { notificationsResponseDto, sendNotificationDto } from "@/types/notifications";

export interface INotificationService {
    notifyParentAboutChild(notificationPayload: sendNotificationDto): Promise<void>;
    getAllNotifications(): Promise<notificationsResponseDto[]>;
}