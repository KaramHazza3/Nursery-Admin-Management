import express from "express";
import { container } from "tsyringe";
import "@/di-container";
import { NotificationController } from "@/controllers/notification.controller";
import { validate } from "@/middlewares/validator";
import { sendNotificationRequestDto } from "@/dtos/notification-dto/notifcation.dto";

const router = express.Router();
const notificationController = container.resolve(NotificationController);

router.get('/', notificationController.getAllAdminNotifications);
router.post('/', validate(sendNotificationRequestDto), notificationController.sendNotification);

export default router;