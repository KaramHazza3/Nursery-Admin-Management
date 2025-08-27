import { AllChildrenResponse, ChildResponseDto, CreateChildDto, UpdateChildDto } from "@/types";

export interface IChildrenRepository {
  createChild(childPayload: CreateChildDto): Promise<string>;
  getChildIdFromName(childName: string): Promise<string | null>;
  deleteChildren(childIds: string[]): Promise<void>;
  getChildrenByParentId(parentId: string): Promise<{ id: string; name: string }[]>;
  editChildClass(childId: string, editedClassId: string): Promise<void>;
  getAllChildrenRaw(): Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>;
  getChildrenDocsByIds(
      childIds: string[]
    ): Promise<FirebaseFirestore.DocumentSnapshot[]>;
  getChildById(childId: string): Promise<FirebaseFirestore.DocumentSnapshot>;
  deleteChild(childId: string): Promise<void>;
  editChild(childId: string, editPayload: UpdateChildDto): Promise<void>;
  getChildrenIdsByClassId(classId: string): Promise<string[]>;
}
