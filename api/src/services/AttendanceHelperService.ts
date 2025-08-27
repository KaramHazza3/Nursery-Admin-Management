import { IAttendanceRepository } from "@/repositories/attendance-repository/intf/IAttendanceRepository";
import { IChildrenRepository } from "@/repositories/children-repository/intf/IChildrenRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class AttendanceHelperService {
  constructor(
    @inject("IAttendanceRepository")
    private readonly attendanceRepository: IAttendanceRepository,
    @inject("IChildrenRepository")
    private readonly childrenRepository: IChildrenRepository
  ) {}

  async getChildrenIdsByClassId(classId: string): Promise<string[]> {
    return await this.childrenRepository.getChildrenIdsByClassId(classId);
  }

  async getChildAttendance(
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    return await this.attendanceRepository.getChildAttendance(
      childId,
      startDate,
      endDate
    );
  }

  async getClassAttendance(
    classId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    const childIds = await this.getChildrenIdsByClassId(classId);

    if (childIds.length === 0) return { present: 0, absent: 0 };

    const totalStatusCount: Record<string, number> = { present: 0, absent: 0 };

    for (const childId of childIds) {
      const childStatusCount = await this.getChildAttendance(childId, startDate, endDate);
      for (const [status, count] of Object.entries(childStatusCount)) {
        totalStatusCount[status] = (totalStatusCount[status] || 0) + count;
      }
    }

    return totalStatusCount;
  }
}
