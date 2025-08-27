import { AddChildToClassDto, ClassResponseDto, CreateClassDto, CreateClassResponseDto, SpecificClassResponseDto } from "@/types";

export interface IClassesService {
  createClassWithNannies(
    createClassPayload: CreateClassDto
  ): Promise<CreateClassResponseDto>;
  editClass(
    className: string,
    updates: { name?: string; nanniesNames: string[] }
  ): Promise<void>;

  getAllClasses(): Promise<ClassResponseDto[]>;
  removeChildFromClass(classId: string, childId: string): Promise<void>;
  getClassById(classId: string): Promise<SpecificClassResponseDto>;
  addChildToClass(classId: string, addChildToClassPayload: AddChildToClassDto): Promise<void>;
  deleteClass(classId: string): Promise<void>;
  getClassAttendance(classId: string, startDate: string, endDate: string): Promise<Record<string, number>>
}
