import { inject, injectable } from "tsyringe";
import { IClassesService } from "../intf/IClassesService";
import { IClassesRepository } from "@/repositories/classes-repository/intf/IClassesRepository";
import { HelperService } from "@/services/LinkClassHelperService";
import {
  AddChildToClassDto,
  ClassResponseDto,
  CreateClassDto,
  CreateClassResponseDto,
  SpecificClassResponseDto,
} from "@/types";
import { IChildrenService } from "@/services/children-service/intf/IChildrenService";
import {
  mapToClassResponse,
  mapToSpecificClassResponse,
} from "@/mappers/class-mapper";
import { NotFoundException } from "@/exceptions/notFound";
import { IAttendanceService } from "@/services/attendance-service/intf/IAttendanceService";

@injectable()
export class ClassesService implements IClassesService {
  constructor(
    @inject("IClassesRepository")
    private readonly classesRepo: IClassesRepository,
    @inject("IChildrenService")
    private readonly childrenService: IChildrenService,
    @inject("HelperService")
    private readonly helperService: HelperService,
    @inject("IAttendanceService")
    private readonly attendanceService: IAttendanceService
  ) {}
  async getClassAttendance(
    classId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    return await this.attendanceService.getClassAttendance(
      classId,
      startDate,
      endDate
    );
  }
  async deleteClass(classId: string): Promise<void> {
    const retrievedClass = await this.classesRepo.getClassDocById(classId);
    if (!retrievedClass) throw new NotFoundException("The class not found");
    await this.classesRepo.deleteClass(classId);
  }

  async getClassById(classId: string): Promise<SpecificClassResponseDto> {
    const classDoc = await this.classesRepo.getClassDocById(classId);

    if (!classDoc || !classDoc.exists) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const classData = classDoc.data();
    const name = classData?.name || "Unnamed";
    const childIds: string[] = classData?.childIds || [];
    const nannyIds: string[] = classData?.nannyIds || [];

    const children = childIds.length
      ? await this.childrenService.getChildrenInfoByIds(childIds)
      : [];

    const nanniesNames: string[] = [];
    if (nannyIds.length) {
      const nanniesSnap = await this.classesRepo.getNannyDocsByIds(nannyIds);
      nanniesSnap.forEach((doc) => {
        const fullName = doc.data()?.personalInfo?.fullName;
        if (fullName) nanniesNames.push(fullName);
      });
    }

    return mapToSpecificClassResponse(
      classDoc.id,
      name,
      children.map((child) => ({
        uid: child.id,
        fullName: child.fullName,
        gender: child.gender,
        age: child.age,
      })),
      nanniesNames
    );
  }

  async addChildToClass(
    classId: string,
    addChildToClassPayload: AddChildToClassDto
  ): Promise<void> {
    const { childName } = addChildToClassPayload;
    const childId = await this.childrenService.getChildIdFromName(childName);
    if (!childId)
      throw new NotFoundException(
        `There is no child called ${childName} exists`
      );
    await this.classesRepo.addChildToClass(childId, classId);
    await this.childrenService.editChildClass(childId, classId);
  }

  async getAllClasses(): Promise<ClassResponseDto[]> {
    const classesSnap = await this.classesRepo.getAllClassDocs();

    if (classesSnap.empty) return [];

    const classesData: ClassResponseDto[] = [];

    for (const classDoc of classesSnap.docs) {
      const data = classDoc.data();

      const childIds: string[] = data?.childIds || [];
      const nannyIds: string[] = data?.nannyIds || [];

      let nanniesNames: string[] = [];
      if (nannyIds.length) {
        const nanniesSnap = await this.classesRepo.getNannyDocsByIds(nannyIds);
        nanniesNames = nanniesSnap
          .map((doc) => doc.data()?.personalInfo?.fullName)
          .filter((name): name is string => !!name);
      }

      const childrenNumber = childIds.length;

      classesData.push(
        mapToClassResponse(
          classDoc.id,
          data?.name || "Unnamed",
          childrenNumber,
          nanniesNames
        )
      );
    }

    return classesData;
  }

  async editClass(
    classId: string,
    updates: { name?: string; nanniesNames?: string[] }
  ): Promise<void> {
    const patchData: {
      name?: string;
      nannyIds?: string[];
    } = {};

    if (updates.name !== undefined) {
      patchData.name = updates.name;
    }

    if (updates.nanniesNames) {
      const nanniesIds = await this.helperService.getNannyIdsFromNames(
        updates.nanniesNames
      );
      patchData.nannyIds = nanniesIds;
    }

    const linkedNannyIds = await this.classesRepo.getNanniesFromClass(classId);
    for (const linkedNannyId of linkedNannyIds) {
      await this.helperService.removeClassesFromNanny(linkedNannyId, [classId]);
    }

    await this.classesRepo.editClass(classId, patchData);

    if (patchData.nannyIds) {
      for (const nannyId of patchData.nannyIds) {
        await this.helperService.addNannyToClasses(nannyId, [classId]);
      }
    }
  }

  async createClassWithNannies(
    createClassPayload: CreateClassDto
  ): Promise<CreateClassResponseDto> {
    const { name, nanniesNames } = createClassPayload;
    const nanniesIds = await this.helperService.getNannyIdsFromNames(
      nanniesNames
    );
    // if (nanniesIds.length !== nanniesNames.length)
    //   throw new NotFoundException("Some of nannies doesn't exist");
    const createdClassId = await this.classesRepo.createClassWithNannies(
      name,
      nanniesIds
    );

    for (const nannyId of nanniesIds) {
      await this.helperService.addNannyToClasses(nannyId, [createdClassId]);
    }

    return {
      id: createdClassId,
      name,
      nanniesNames,
    };
  }

  async removeChildFromClass(classId: string, childId: string): Promise<void> {
    await this.classesRepo.deleteChildFromClass(classId, childId);
    await this.childrenService.editChildClass(childId, "");
  }
}
