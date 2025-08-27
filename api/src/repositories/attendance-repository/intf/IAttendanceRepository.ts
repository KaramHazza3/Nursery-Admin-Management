export interface IAttendanceRepository {
    getChildAttendance(childId: string, startDate: string, endDate:string): Promise<Record<string, number>>;
}