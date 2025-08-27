import { inject, injectable } from "tsyringe";
import { INotificationService } from "../intf/INotificationService";
import { INotificationRepository } from "@/repositories/notification-repository/intf/INotificationRepository";
import {
  notificationsResponseDto,
  sendNotificationDto,
} from "@/types/notifications";
import { IChildrenService } from "@/services/children-service/intf/IChildrenService";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject("INotificationRepository")
    private readonly notificationRepository: INotificationRepository,
    @inject("IChildrenService")
    private readonly childrenService: IChildrenService
  ) {}

  async getAllNotifications(): Promise<notificationsResponseDto[]> {
    const querySnapshot =
      await this.notificationRepository.getAllNotifications();

    const notifications = await Promise.all(
      querySnapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return (
            data.recipients &&
            Array.isArray(data.recipients) &&
            data.recipients.length > 0
          );
        })
        .map(async (doc) => {
          const data = doc.data();
          const parentNameOfChild =
            await this.childrenService.getParentNameOfChild(data.recipients[0]);
          const date =
            data.timestamp?.toDate().toISOString().split("T")[0] ?? null;

          return {
            date,
            parentName: parentNameOfChild,
            content: data.content,
          };
        })
    );
    return notifications;
  }

  async notifyParentAboutChild(
    notificationPayload: sendNotificationDto
  ): Promise<void> {
    await this.notificationRepository.sendNotification(notificationPayload);
  }
}
