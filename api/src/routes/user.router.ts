import express from "express";
import { UserController } from "@/controllers/user.controller";
import { container } from "tsyringe";
import "@/di-container";
import { validate } from "@/middlewares/validator";
import { CreateNannyDto, UpdateNannyDto } from "@/dtos/user-dto/nanny-user.dto";
import {
  CreateParentUserWithChildrenDto,
  UpdateParentDto,
} from "@/dtos/user-dto/parent-user.dto";
import { CreateAdminDto, CreateAdminRequestDto } from "@/dtos/user-dto/admin-user.dto";

const router = express.Router();
const userController = container.resolve(UserController);

router.get("/nannies", userController.getAllNannies);
router.get("/parents", userController.getAllParents);
router.get("/parents/:uid", userController.getParentById);
router.get("/nannies/:uid", userController.getNannyById);
router.delete("/nannies/:uid", userController.deleteNannyById);
router.delete("/parents/:uid", userController.deleteParent);
router.post("/nannies", validate(CreateNannyDto), userController.createNanny);
router.post(
  "/parents",
  validate(CreateParentUserWithChildrenDto),
  userController.createParent
);
router.patch(
  "/nannies/:uid",
  validate(UpdateNannyDto),
  userController.editNannyById
);
router.patch(
  "/parents/:uid",
  validate(UpdateParentDto),
  userController.editParentById
);

router.get('/parents/:uid/children', userController.getChildrenOfParent);

export default router;
