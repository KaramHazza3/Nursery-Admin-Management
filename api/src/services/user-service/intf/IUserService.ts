import { CreateNannyUserDto, CreateParentUserWithChildrenDto, NannyUserResponse, ParentUser, ParentUserResponseDto, UpdateNannyDto, UpdateParentDto, User, ViewParentUserResponseDto } from "@/types";

export interface IUserService {
  getAllNannies(): Promise<NannyUserResponse[]>;
  deleteUserById(uid: string): Promise<void>;
  createNanny(nannyPayload: CreateNannyUserDto): Promise<NannyUserResponse>;
  editNanny(nannyId: string, nannyPayload: UpdateNannyDto) : Promise<NannyUserResponse>;
  editParent(uid: string, editPayload: UpdateParentDto): Promise<ParentUser>;
  getNannyByIdWithClasses(uid: string): Promise<NannyUserResponse | null>;
  createParent(parentPayload: CreateParentUserWithChildrenDto): Promise<ParentUserResponseDto>;
  getNannyIdsFromNames(nannyNames: string[]): Promise<string[]>;
  getAllNannyNames(): Promise<string[]>;
  getAllParents(): Promise<ViewParentUserResponseDto[]>;
  getParentById(parentId: string): Promise<ParentUserResponseDto>;
  deleteParent(parentId: string): Promise<void>;
  deleteNanny(nannyId: string): Promise<void>;
  createAdmin(username: string, passwsord: string): Promise<void>;
  getChildrenOfParent(parentId: string): Promise<{ id: string; name: string }[]>;
}