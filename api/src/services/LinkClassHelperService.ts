import { injectable, inject } from "tsyringe";
import { IUserRepository } from "@/repositories/user-repository/intf/IUserRepository";
import { IClassesRepository } from "@/repositories/classes-repository/intf/IClassesRepository";
import { ParentUser } from "@/types";

@injectable()
export class HelperService {
  constructor(
    @inject("IUserRepository") private readonly userRepository: IUserRepository,
    @inject("IClassesRepository")
    private readonly classesRepository: IClassesRepository
  ) {}

  async getNannyIdsFromNames(nannyNames: string[]): Promise<string[]> {
    return await this.userRepository.getNannyIdsFromNames(nannyNames);
  }

  async getClassIdsByNames(classNames: string[]): Promise<string[]> {
    return await this.classesRepository.getClassIdsByNames(classNames);
  }

  async addNannyToClasses(nannyId: string, classIds: string[]): Promise<void> {
    await this.classesRepository.addNannyToClasses(nannyId, classIds);
    await this.userRepository.addNannyToClasses(nannyId, classIds);
  }

  async addChildToClass(childId: string, classId: string): Promise<void> {
    await this.classesRepository.addChildToClass(childId, classId);
  }

  async removeDeletedChildIdsFromClasses(
    childIdsToRemove: string[]
  ): Promise<void> {
    await this.classesRepository.removeDeletedChildIdsFromClasses(
      childIdsToRemove
    );
  }

  async removeClassesFromNanny(
    nannyId: string,
    classIds: string[]
  ): Promise<void> {
    await this.userRepository.removeNannyFromClasses(nannyId, classIds);
  }

  async removeNannyFromClasses(
    nannyId: string,
    classIds: string[]
  ): Promise<void> {
    await this.classesRepository.removeNannyFromClasses(nannyId, classIds);
  }

  async getClassNamesByIds(
    classIds: string[]
  ): Promise<Record<string, string>> {
    return await this.classesRepository.getClassNamesByIds(classIds);
  }

  async getParentInfoFromChild(parentId: string): Promise<ParentUser> {
    const parent = await this.userRepository.getParentByIdRaw(parentId);
    return parent as ParentUser;
  }

  async removeChildFromParent(parentId: string, childId: string): Promise<void> {
    await this.userRepository.removeChildFromParent(parentId, childId);
  }
}
