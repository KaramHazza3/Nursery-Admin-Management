import { notificationsResponseDto, sendNotificationDto } from "@/types/notifications";

export interface INotificationRepository {
    sendNotification(notificationPayload: sendNotificationDto): Promise<void>;
    getAllNotifications() : Promise<FirebaseFirestore.QuerySnapshot>;
}