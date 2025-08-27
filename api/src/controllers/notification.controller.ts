import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import HTTP_STATUS from "@/utils/http-status-codes";
import asyncHandler from "@/utils/async-handler";
import { INotificationService } from "@/services/notifcation-service/intf/INotificationService";
import { sendNotificationDto } from "@/types/notifications";
import { AuthRequest } from "@/middlewares/authentication";
import { FieldValue } from "firebase-admin/firestore";


@injectable()
export class NotificationController {
  constructor(
    @inject("INotificationService") private readonly notifcationService: INotificationService
  ) {}

  sendNotification = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const {childId, content} = req.body;
     const notificationPayload: sendNotificationDto = {
      author: req.user!.uid,
      authorName: "مسؤولة الحضانة",
      content: content,
      recipients: [childId],
      type: "text",
      timestamp: FieldValue.serverTimestamp(),
      sendByAdmin: true
    };
    await this.notifcationService.notifyParentAboutChild(notificationPayload);
    res.status(HTTP_STATUS.CREATED).json("The user has been notified successfully");
  });

  getAllAdminNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const allNotifications = await this.notifcationService.getAllNotifications();
    res.status(HTTP_STATUS.OK).json(allNotifications);
  });

}