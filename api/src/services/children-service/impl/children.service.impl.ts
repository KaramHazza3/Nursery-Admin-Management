import {
  AllChildrenResponse,
  ChildShortInfoDto,
  ChildWithParentResponseDto,
  CreateChildDto,
  UpdateChildDto,
} from "@/types";
import { IChildrenService } from "../intf/IChildrenService";
import { inject, injectable } from "tsyringe";
import { IChildrenRepository } from "@/repositories/children-repository/intf/IChildrenRepository";
import { mapChildSnapshotToResponse } from "@/mappers/child-mapper";
import { NotFoundException } from "@/exceptions/notFound";
import { HelperService } from "@/services/LinkClassHelperService";
import { calculateAge } from "@/utils/dateUtils";
import { mapChildWithParent } from "@/mappers/child-mapper";
import { AttendanceHelperService } from "@/services/AttendanceHelperService";
import { IUserService } from "@/services/user-service/intf/IUserService";

@injectable()
export class ChildrenService implements IChildrenService {
  constructor(
    @inject("IChildrenRepository")
    private readonly childrenRepository: IChildrenRepository,
    @inject("HelperService")
    private readonly helperService: HelperService,
    @inject("AttendanceHelperService")
    private readonly attendanceHelperService: AttendanceHelperService
  ) {}
  async getParentNameOfChild(childId: string): Promise<string> {
    const childInfo = await this.childrenRepository.getChildById(childId);
    if(!childInfo) throw new NotFoundException("The child doesn't exist");
    const childData = childInfo.data()!;
    const parentInfo = await this.helperService.getParentInfoFromChild(childData.parentId);
    if(parentInfo.relation == 'mother') return parentInfo.mother.fullName;
    return parentInfo.father.fullName;
  }
  async getChildAttendance(childId: string, startDate: string, endDate: string): Promise<Record<string, number>> {
    return await this.attendanceHelperService.getChildAttendance(childId, startDate, endDate);
  }
  async editChild(childId: string, editPayload: UpdateChildDto): Promise<void> {
    const child = await this.childrenRepository.getChildById(childId);
    if(!child.exists) throw new NotFoundException("The child doesn't exist");
    await this.childrenRepository.editChild(childId, editPayload);
  }
  async deleteChild(childId: string): Promise<void> {
    const currentChildSnap = await this.childrenRepository.getChildById(
      childId
    );

    if (!currentChildSnap.exists) {
      throw new NotFoundException(`Child with ID ${childId} does not exist`);
    }

    const childData = currentChildSnap.data();
    const parentId = childData?.parentId;
    await this.childrenRepository.deleteChild(childId);
    await this.helperService.removeChildFromParent(parentId, childId);
  }

  async getChildWithParentById(
    childId: string
  ): Promise<ChildWithParentResponseDto> {
    const child = await this.childrenRepository.getChildById(childId);
    if (!child.exists)
      throw new NotFoundException("Sorry, this child doesn't exist");

    const childData = child.data()!;
    const parentOfChild = await this.helperService.getParentInfoFromChild(
      childData.parentId
    );

    return mapChildWithParent(childData, parentOfChild);
  }

  async getAllChildren(): Promise<AllChildrenResponse[]> {
    const snapshot = await this.childrenRepository.getAllChildrenRaw();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const name = data.personalInfo?.childName;
      const dob = data.personalInfo?.dob;

      if (!name || !dob) throw new Error("Invalid child data");

      return mapChildSnapshotToResponse(doc.id, name, dob);
    });
  }

  async editChildClass(childId: string, editedClassId: string): Promise<void> {
    await this.childrenRepository.editChildClass(childId, editedClassId);
  }

  async deleteChildren(childIds: string[]): Promise<void> {
    await this.childrenRepository.deleteChildren(childIds);
  }

  async getChildrenByParentId(
    parentId: string
  ): Promise<{ id: string; name: string }[]> {
    return await this.childrenRepository.getChildrenByParentId(parentId);
  }

  async getChildIdFromName(childName: string): Promise<string> {
    const child = await this.childrenRepository.getChildIdFromName(childName);
    if (!child) throw new NotFoundException("The child doesn't exist");
    return child;
  }

  async createChild(childPayload: CreateChildDto): Promise<string> {
    return await this.childrenRepository.createChild(childPayload);
  }

  async getChildrenInfoByIds(childIds: string[]): Promise<ChildShortInfoDto[]> {
    const childrenDocs = await this.childrenRepository.getChildrenDocsByIds(
      childIds
    );
    const result: {
      id: string;
      fullName: string;
      gender: string;
      age: number;
    }[] = [];

    for (const doc of childrenDocs) {
      const data = doc.data();
      const fullName = data?.personalInfo?.childName;
      const dob = data?.personalInfo?.dob;
      const gender = data?.personalInfo?.gender;

      if (fullName && dob && gender) {
        const age = calculateAge(dob);
        result.push({ id: doc.id, fullName, gender, age });
      }
    }

    return result;
  }
}
