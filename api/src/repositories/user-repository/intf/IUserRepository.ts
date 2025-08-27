import {
  NannyUserResponse,
  ParentUser,
  ParentUserResponseDto,
  UpdateNannyDto,
  UpdateParentDto,
  User,
  ViewParentUserResponseDto,
} from "@/types";

export interface IUserRepository {
  getAllNannies(): Promise<
    { uid: string; data: FirebaseFirestore.DocumentData }[]
  >;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(uid: string): Promise<User | null>;
  deleteUserById(uid: string): Promise<void>;
  createUser<TInput extends object, TReturn extends object>(
    uid: string,
    payload: TInput
  ): Promise<TReturn>;
  editNanny(
    uid: string,
    editPayload: UpdateNannyDto
  ): Promise<NannyUserResponse>;
  editParent(uid: string, editPayload: UpdateParentDto): Promise<ParentUser>;
  getNannyIdsFromNames(nannyNames: string[]): Promise<string[]>;
  getAllNannyNames(): Promise<string[]>;
  getAllParents(): Promise<ViewParentUserResponseDto[]>;
  getParentByIdRaw(parentId: string): Promise<ParentUser | null>;
  addNannyToClasses(nannyId: string, classIds: string[]): Promise<void>;
  removeNannyFromClasses(nannyId: string, classIds: string[]): Promise<void>;
  getNannyById(uid: string): Promise<NannyUserResponse | null>;
  removeChildFromParent(parentId: string, childId: string): Promise<void>;
}
