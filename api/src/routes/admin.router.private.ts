import { Router } from "express";
import { validate } from "@/middlewares/validator";
import { CreateAdminRequestDto } from "@/dtos/user-dto/admin-user.dto";
import { container } from "tsyringe";
import { UserController } from "@/controllers/user.controller";
import { adminApiKeyMiddleware } from "@/middlewares/adminApiKey";

const router = Router();
const userController = container.resolve(UserController);

router.post("/admin", adminApiKeyMiddleware, validate(CreateAdminRequestDto), userController.createAdmin);

export default router;
