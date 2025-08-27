import { db } from "@/config/firebaseAdmin";
import { INotificationRepository } from "../intf/INotificationRepository";
import { sendNotificationDto } from "@/types/notifications";

export class NotificationRepository implements INotificationRepository {
  async getAllNotifications(): Promise<FirebaseFirestore.QuerySnapshot> {
    return await db
    .collection("nanny_notifications")
    .where("sendByAdmin", "==", true)
    .get();
  }

  async sendNotification(
    notificationPayload: sendNotificationDto
  ): Promise<void> {
    await db.collection("nanny_notifications").add(notificationPayload);
  }
}
