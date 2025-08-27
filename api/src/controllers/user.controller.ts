import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IUserService } from "@/services/user-service/intf/IUserService";
import HTTP_STATUS from "@/utils/http-status-codes";
import asyncHandler from "@/utils/async-handler";
import { NannyUser, NannyUserResponse } from "@/types";

@injectable()
export class UserController {
  constructor(
    @inject("IUserService") private readonly userService: IUserService
  ) {}

  getAllNannies = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const nannies: NannyUserResponse[] = await this.userService.getAllNannies();
      res.status(HTTP_STATUS.OK).json({ nannies });
    }
  );

  deleteNannyById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      await this.userService.deleteNanny(uid);
      res
        .status(HTTP_STATUS.NO_CONTENT).end();
    }
  );

  createNanny = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        email,
        password,
        personalInfo,
        privileges,
        linkedClasses,
        salaryInfo,
      } = req.body;
      const newNanny = await this.userService.createNanny({
        email,
        password,
        personalInfo,
        privileges,
        linkedClasses,
        salaryInfo,
        role: "nanny",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.status(HTTP_STATUS.CREATED).json({
        message: "Nanny user created successfully",
        data: newNanny,
      });
    }
  );

  getNannyById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = await this.userService.getNannyByIdWithClasses(
        req.params.uid
      );
      res.status(HTTP_STATUS.CREATED).json(user);
    }
  );

  editNannyById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const editPayload = req.body;
      const user = await this.userService.editNanny(uid, editPayload);
      res.status(HTTP_STATUS.OK).json(user);
    }
  );

    editParentById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const editPayload = req.body;
      const updatedUser = await this.userService.editParent(uid, editPayload);
      res.status(HTTP_STATUS.OK).json(updatedUser);
    }
  );

  createParent = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const parentWithChildrenPayload = req.body;
      const user = await this.userService.createParent(
        parentWithChildrenPayload
      );
      res.status(HTTP_STATUS.CREATED).json(user);
    }
  );

  getAllParents = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const parents = await this.userService.getAllParents();
      res.status(HTTP_STATUS.OK).json(parents);
    }
  );

  getParentById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const uid = req.params.uid;
      const user = await this.userService.getParentById(uid);
      res.status(HTTP_STATUS.OK).json(user);
    }
  );

   deleteParent = asyncHandler(async (req: Request, res: Response): Promise<void> =>{
    const parentId = req.params.uid;
    await this.userService.deleteParent(parentId);
    res.status(HTTP_STATUS.NO_CONTENT).end();
  });

  createAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;
    await this.userService.createAdmin(username, password);
    res.status(HTTP_STATUS.CREATED).json("The admin has been created successfully");
  });

  getChildrenOfParent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const parentId = req.params.uid;
    const children = await this.userService.getChildrenOfParent(parentId);
    res.status(HTTP_STATUS.OK).json(children);
  });
}
