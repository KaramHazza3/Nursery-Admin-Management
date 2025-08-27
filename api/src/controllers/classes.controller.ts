import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import HTTP_STATUS from "@/utils/http-status-codes";
import asyncHandler from "@/utils/async-handler";
import { IClassesService } from "@/services/classes-service/intf/IClassesService";
import { CreateClassDto } from "@/types";

@injectable()
export class ClassesController {
  constructor(
    @inject("IClassesService") private readonly classesService: IClassesService
  ) {}

  createClass = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, nanniesNames } = req.body;
      const createClassPayload: CreateClassDto = {
        name,
        nanniesNames,
      };
      const createdClass = await this.classesService.createClassWithNannies(
        createClassPayload
      );
      res.status(HTTP_STATUS.CREATED).json(createdClass);
    }
  );

  editClass = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, nanniesNames } = req.body;
      const patchUpdates = {
        name,
        nanniesNames,
      };
      await this.classesService.editClass(req.params.uid, patchUpdates);
      res.status(HTTP_STATUS.OK).json("The class has been updated");
    }
  );

  getAllClasses = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const classes = await this.classesService.getAllClasses();
      res.status(HTTP_STATUS.OK).json(classes);
    }
  );

  removeChildFromClass = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const classId = req.params.uid;
      const childId = req.params.childId;
      await this.classesService.removeChildFromClass(classId, childId);
      res.status(HTTP_STATUS.NO_CONTENT).end();
    }
  );

  getClassById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const classId = req.params.uid;
      const foundClass = await this.classesService.getClassById(classId);
      res.status(HTTP_STATUS.OK).json(foundClass);
    }
  );

  addChildToClass = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const classId = req.params.uid;
      const { childName } = req.body;
      const addChildToClassPayload = {
        childName,
      };
      await this.classesService.addChildToClass(
        classId,
        addChildToClassPayload
      );
      res.status(HTTP_STATUS.OK).json("The child has been added");
    }
  );

  deleteClass = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      await this.classesService.deleteClass(uid);
      res.status(HTTP_STATUS.NO_CONTENT).end();
    }
  );

  getClassAttendance = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      const result = await this.classesService.getClassAttendance(
        uid,
        startDate,
        endDate
      );
      res.status(HTTP_STATUS.OK).json(result);
    }
  );
}
