import express from "express";
import { container } from "tsyringe";
import "@/di-container";
import { ClassesController } from "@/controllers/classes.controller";
import { validate, validateQuery } from "@/middlewares/validator";
import {
  AddChildToClassDto,
  CreateClassDto,
  EditClassDtoPartial,
} from "@/dtos/classes-dto/classes.dto";
import { AttendanceQuerySchema } from "@/schemas/attendance.schema";

const router = express.Router();
const classesController = container.resolve(ClassesController);

router.post("/", validate(CreateClassDto), classesController.createClass);
router.post(
  "/:uid/children/",
  validate(AddChildToClassDto),
  classesController.addChildToClass
);
router.patch(
  "/:uid",
  validate(EditClassDtoPartial),
  classesController.editClass
);
router.get("/", classesController.getAllClasses);
router.get("/:uid", classesController.getClassById);
router.get('/:uid/attendance', validateQuery(AttendanceQuerySchema), classesController.getClassAttendance);
router.delete(
  "/:uid/children/:childId",
  classesController.removeChildFromClass
);
router.delete('/:uid', classesController.deleteClass);

export default router;