export interface IAttendanceService {
    getChildAttendance(childId: string, startDate: string, endDate: string): Promise<Record<string, number>>;
    getClassAttendance(classId: string, startDate: string, endDate: string): Promise<Record<string, number>>;
}