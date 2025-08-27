import { inject, injectable } from "tsyringe";
import { UserNotFound } from "@/exceptions/userNotFound";
import { ForbiddenException } from "@/exceptions/forbiddenException";
import { IUserRepository } from "@/repositories/user-repository/intf/IUserRepository";
import { IUserService } from "../intf/IUserService";
import { auth } from "@/config/firebaseAdmin";
import {
  CreateNannyUserDto,
  UpdateNannyDto,
  NannyUserResponse,
  CreateParentUserDto,
  CreateParentUserWithChildrenDto,
  ParentUserResponseDto,
  ViewParentUserResponseDto,
  UpdateParentDto,
  ParentUser,
  CreateAdminDto,
  CreateAdminResponseDto,
  ChildShortInfoDto,
} from "@/types";
import { IChildrenService } from "@/services/children-service/intf/IChildrenService";
import { HelperService } from "@/services/LinkClassHelperService";
import { NotFoundException } from "@/exceptions/notFound";
import { UserAlreadyExist } from "@/exceptions/userAlreadyExist";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("HelperService")
    private readonly helperService: HelperService,
    @inject("IChildrenService")
    private readonly childrenService: IChildrenService
  ) {}
  async getChildrenOfParent(
    parentId: string
  ): Promise<{ id: string; name: string }[]> {
    return await this.childrenService.getChildrenByParentId(parentId);
  }
  async createAdmin(username: string, password: string): Promise<void> {
    const email = `${username}@growapp.dev`;
    const emailExists = await this.checkIfUserExists(email);
    if (emailExists) {
      throw new UserAlreadyExist();
    }
    const createdUser = await auth.createUser({
      email,
      password,
    });
    await this.userRepository.createUser<
      CreateAdminDto,
      CreateAdminResponseDto
    >(createdUser.uid, {
      role: "admin",
      created_at: new Date(),
      uid: createdUser.uid,
      email,
    });
  }
  async deleteNanny(nannyId: string): Promise<void> {
    const currentNanny = await this.getNannyByIdWithClasses(nannyId);
    if (!currentNanny) {
      throw new NotFoundException("User not found.");
    }

    if (currentNanny.role !== "nanny") {
      throw new ForbiddenException("Access denied. User is not a nanny.");
    }
    await this.userRepository.deleteUserById(nannyId);
    if (currentNanny?.linkedClasses.length) {
      const previousLinkedClassNames = currentNanny?.linkedClasses;
      const previousLinkedClassIds =
        await this.helperService.getClassIdsByNames(previousLinkedClassNames);
      await this.helperService.removeNannyFromClasses(
        nannyId,
        previousLinkedClassIds
      );
    }
  }
  async deleteParent(parentId: string): Promise<void> {
    const user = await this.userRepository.getUserById(parentId);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (user.role !== "parent") {
      throw new ForbiddenException("Access denied. User is not a parent.");
    }
    const linkedChilds = await this.childrenService.getChildrenByParentId(
      parentId
    );
    const linkedChildIds = linkedChilds.map((child) => child.id);
    await this.childrenService.deleteChildren(linkedChildIds);
    await this.userRepository.deleteUserById(parentId);
    await this.helperService.removeDeletedChildIdsFromClasses(linkedChildIds);
  }
  async getAllParents(): Promise<ViewParentUserResponseDto[]> {
    return await this.userRepository.getAllParents();
  }

  async getNannyIdsFromNames(nannyNames: string[]): Promise<string[]> {
    return await this.userRepository.getNannyIdsFromNames(nannyNames);
  }
  async getAllNannyNames(): Promise<string[]> {
    return await this.userRepository.getAllNannyNames();
  }

  async createNanny(
    nannyPayload: CreateNannyUserDto
  ): Promise<NannyUserResponse> {
    const emailExists = await this.checkIfUserExists(nannyPayload.email);
    if (emailExists) {
      throw new UserAlreadyExist();
    }

    const createdUser = await auth.createUser({
      email: nannyPayload.email,
      password: nannyPayload.password,
    });
    const classIds = await this.helperService.getClassIdsByNames(
      nannyPayload.linkedClasses
    );

    if (classIds.length !== nannyPayload.linkedClasses.length) {
      throw new NotFoundException("Some class names were not found.");
    }
    const { password, ...nannyPayloadWithoutPassword } = nannyPayload;

    const updatedPayload: CreateNannyUserDto = {
      ...nannyPayloadWithoutPassword,
      linkedClasses: classIds,
    };

    const createdNanny = await this.userRepository.createUser<
      CreateNannyUserDto,
      NannyUserResponse
    >(createdUser.uid, updatedPayload);

    if (classIds.length) {
      await this.helperService.addNannyToClasses(createdUser.uid, classIds);
    }

    return createdNanny;
  }
  async createParent(
    parentPayload: CreateParentUserWithChildrenDto
  ): Promise<ParentUserResponseDto> {
    const isMother = parentPayload.relation === "mother";
    const parent = isMother ? parentPayload.mother : parentPayload.father;

    const emailExists = await this.checkIfUserExists(parent.email);
    if (emailExists) {
      throw new UserAlreadyExist();
    }
    const createdUser = await auth.createUser({
      email: parent.email,
      password: parent.password,
    });

    const parentId = createdUser.uid;

    const linkedChildren = parentPayload.linkedChildren;
    const linkedChildrenIds: string[] = [];
    for (const child of linkedChildren) {
      const classId = await this.helperService.getClassIdsByNames([
        child.classId,
      ]);
      if (!classId[0]) {
        throw new NotFoundException(`Class not found: ${child.classId}`);
      }
      child.classId = classId[0];
      child.parentId = parentId;
      child.createdAt = new Date();
      const childId = await this.childrenService.createChild(child);
      linkedChildrenIds.push(childId);
      this.helperService.addChildToClass(childId, child.classId);
    }
    const { password: __, ...motherSafe } = parentPayload.mother;
    const { password: ____, ...fatherSafe } = parentPayload.father;

    const updatedPayload: CreateParentUserDto = {
      ...parentPayload,
      mother: motherSafe,
      father: fatherSafe,
      email: parent.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      linkedChildren: linkedChildrenIds,
    };

    return await this.userRepository.createUser<
      CreateParentUserDto,
      ParentUserResponseDto
    >(parentId, updatedPayload);
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    try {
      await auth.getUserByEmail(email);
      return true;
    } catch (err: any) {
      if (err.code === "auth/user-not-found") return false;
      throw err;
    }
  }

  async getAllNannies(): Promise<NannyUserResponse[]> {
    const nanniesRaw = await this.userRepository.getAllNannies();

    const allClassIds = new Set<string>();
    for (const { data } of nanniesRaw) {
      (data.linkedClasses || []).forEach((id: string) => allClassIds.add(id));
    }

    const classMap = await this.helperService.getClassNamesByIds(
      Array.from(allClassIds)
    );

    return nanniesRaw.map(({ uid, data }) => ({
      uid,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      personalInfo: data.personalInfo,
      salaryInfo: data.salaryInfo,
      privileges: data.privileges,
      linkedClasses: (data.linkedClasses || []).map(
        (id: string) => classMap[id] || "Unknown Class"
      ),
    }));
  }

  async getNannyByIdWithClasses(uid: string): Promise<NannyUserResponse> {
    const data = await this.userRepository.getNannyById(uid);
    if (!data || data.role !== "nanny")
      throw new NotFoundException("User not found or not a nanny");

    const linkedClassIds: string[] = data.linkedClasses ?? [];
    const classMap = await this.helperService.getClassNamesByIds(
      linkedClassIds
    );

    return {
      uid: data.uid,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      personalInfo: data.personalInfo,
      salaryInfo: data.salaryInfo,
      privileges: data.privileges,
      linkedClasses: linkedClassIds.map(
        (id) => classMap[id] || "Unknown Class"
      ),
    };
  }

  async deleteUserById(uid: string): Promise<void> {
    const user = await this.userRepository.getUserById(uid);
    if (!user) throw new UserNotFound();
    await this.userRepository.deleteUserById(uid);
  }

  async editNanny(
    nannyId: string,
    nannyPayload: UpdateNannyDto
  ): Promise<NannyUserResponse> {
    const nanny = await this.getNannyByIdWithClasses(nannyId);

    if (!nanny) throw new UserNotFound();
    if (nanny.role != "nanny")
      throw new ForbiddenException("This user is not a nanny");

    let previousClassIds: string[] = [];
    if (nanny?.linkedClasses?.length) {
      previousClassIds = await this.helperService.getClassIdsByNames(
        nanny.linkedClasses
      );
    }

    if (nannyPayload.linkedClasses?.length) {
      const newClassIds = await this.helperService.getClassIdsByNames(
        nannyPayload.linkedClasses
      );

      const toRemove = previousClassIds.filter(
        (id) => !newClassIds.includes(id)
      );
      const toAdd = newClassIds.filter((id) => !previousClassIds.includes(id));

      const updatedPayload: UpdateNannyDto = {
        ...nannyPayload,
        linkedClasses: newClassIds,
        updatedAt: new Date(),
      };
      const updatedUser = await this.userRepository.editNanny(
        nannyId,
        updatedPayload
      );

      if (toRemove.length) {
        await this.helperService.removeNannyFromClasses(nannyId, toRemove);
      }
      if (toAdd.length) {
        await this.helperService.addNannyToClasses(nannyId, toAdd);
      }

      return updatedUser;
    }

    return await this.userRepository.editNanny(nannyId, {
      ...nannyPayload,
      updatedAt: new Date(),
    });
  }

  async editParent(
  uid: string,
  editPayload: UpdateParentDto
): Promise<ParentUser> {
  const parent = await this.userRepository.getParentByIdRaw(uid);
  if (!parent) throw new UserNotFound();
  if (parent.role !== "parent")
    throw new ForbiddenException("This user is not a parent");

  if (editPayload.children?.length) {
    const newChildrenIds = await Promise.all(
      editPayload.children.map(async (child) => {
        const [resolvedClassId] = await this.helperService.getClassIdsByNames([
          child.classId
        ]);

        const childWithResolved = {
          ...child,
          classId: resolvedClassId,
          parentId: uid
        };

        const createdChild = await this.childrenService.createChild(childWithResolved);
        const classId = resolvedClassId;

        await this.helperService.addChildToClass(createdChild, classId);

        return createdChild;
      })
    );

    editPayload.linkedChildren = newChildrenIds;
    delete editPayload.children;
  }

  return await this.userRepository.editParent(uid, editPayload);
}


  async getParentById(parentId: string): Promise<ParentUserResponseDto> {
    const parentData = await this.userRepository.getParentByIdRaw(parentId);

    if (!parentData) throw new NotFoundException("User not found.");
    if (parentData.role !== "parent")
      throw new ForbiddenException("Access denied. User is not a parent.");

    const linkedChildrenIds: string[] = parentData.linkedChildren || [];
    let childrenInfo: ChildShortInfoDto[] = [];
    if (linkedChildrenIds.length > 0) {
      childrenInfo = await this.childrenService.getChildrenInfoByIds(
        linkedChildrenIds
      );
    }
    return {
      email: parentData.email,
      father: parentData.father,
      mother: parentData.mother,
      address: parentData.address,
      role: parentData.role,
      children: childrenInfo,
      relation: parentData.relation,
    };
  }
}
