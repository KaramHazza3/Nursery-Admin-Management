import {
  AllChildrenResponse,
  ChildShortInfoDto,
  ChildWithParentResponseDto,
  CreateChildDto,
  UpdateChildDto,
} from "@/types";

export interface IChildrenService {
  createChild(childPayload: CreateChildDto): Promise<string>;
  getChildIdFromName(childName: string): Promise<string>;
  deleteChildren(childIds: string[]): Promise<void>;
  getChildrenByParentId(
    parentId: string
  ): Promise<{ id: string; name: string }[]>;
  editChildClass(childId: string, editedClassId: string): Promise<void>;
  getAllChildren(): Promise<AllChildrenResponse[]>;
  getChildrenInfoByIds(childIds: string[]): Promise<ChildShortInfoDto[]>;
  getChildWithParentById(childId: string): Promise<ChildWithParentResponseDto>;
  deleteChild(childId: string): Promise<void>;
  editChild(childId: string, editPayload: UpdateChildDto): Promise<void>;
  getChildAttendance(
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>>;
  getParentNameOfChild(childId: string): Promise<string>;
}
