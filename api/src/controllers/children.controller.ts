import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import HTTP_STATUS from "@/utils/http-status-codes";
import asyncHandler from "@/utils/async-handler";
import { IChildrenService } from "@/services/children-service/intf/IChildrenService";

@injectable()
export class ChildrenController {
  constructor(
    @inject("IChildrenService")
    private readonly childrenService: IChildrenService
  ) {}

  getAllChildren = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const children = await this.childrenService.getAllChildren();
      res.status(HTTP_STATUS.OK).json(children);
    }
  );

  getChildById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const child = await this.childrenService.getChildWithParentById(uid);
      res.status(HTTP_STATUS.OK).json(child);
    }
  );

  deleteChildById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      await this.childrenService.deleteChild(uid);
      res.status(HTTP_STATUS.NO_CONTENT).end();
    }
  );

  editChildById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const updatePayload = req.body;
      await this.childrenService.editChild(uid, updatePayload);
      res.status(HTTP_STATUS.OK).json("The child has been updated");
    }
  );

  getChildAttendance = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const { startDate, endDate } = req.query as {
        startDate: string;
        endDate: string;
      };

      const result = await this.childrenService.getChildAttendance(
        uid,
        startDate,
        endDate
      );
      res.status(HTTP_STATUS.OK).json(result);
    }
  );
}
