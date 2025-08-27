import { CreateClassDto } from "@/types";

export interface IClassesRepository {
  getClassIdsByNames(classNames: string[]): Promise<string[]>;

  addNannyToClasses(nannyId: string, classIds: string[]): Promise<void>;

  addChildToClass(childId: string, classId: string): Promise<void>;

  createClassWithNannies(
    className: string,
    nanniesIds: string[]
  ): Promise<string>;

  editClass(
    classId: string,
    updates: {
      name?: string;
      nannyIds?: string[];
    }
  ): Promise<void>;

  getAllClassDocs(): Promise<
    FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  >;

  getClassDocById(
    classId: string
  ): Promise<FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData> | null>;

  getNannyDocsByIds(
    nannyIds: string[]
  ): Promise<FirebaseFirestore.DocumentSnapshot[]>;

  deleteChildFromClass(classId: string, childId: string): Promise<void>;

  removeDeletedChildIdsFromClasses(childIdsToRemove: string[]): Promise<void>;

  getNanniesFromClass(classId: string): Promise<string[]>;

  removeNannyFromClasses(nannyId: string, classIds: string[]): Promise<void>;

  deleteClass(classId: string): Promise<void>;

  getClassNamesByIds(classIds: string[]): Promise<Record<string, string>>;
}
