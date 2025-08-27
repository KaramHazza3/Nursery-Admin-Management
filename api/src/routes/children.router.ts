import express from "express";
import { container } from "tsyringe";
import "@/di-container";
import { ChildrenController } from "@/controllers/children.controller";
import { validate, validateQuery } from "@/middlewares/validator";
import { UpdateChildDto } from "@/dtos/children-dto/children.dto";
import { AttendanceQuerySchema } from "@/schemas/attendance.schema";

const router = express.Router();
const childrenController = container.resolve(ChildrenController);

router.get('/', childrenController.getAllChildren);
router.get('/:uid', childrenController.getChildById);
router.get('/:uid/attendance', validateQuery(AttendanceQuerySchema), childrenController.getChildAttendance);
router.delete('/:uid', childrenController.deleteChildById);
router.patch('/:uid', validate(UpdateChildDto), childrenController.editChildById);

export default router;