import { injectable } from "tsyringe";
import { IAttendanceRepository } from "../intf/IAttendanceRepository";
import { db } from "@/config/firebaseAdmin";
import { firestore } from "firebase-admin";
import { FieldPath } from "firebase-admin/firestore";

@injectable()
export class AttedanceRepository implements IAttendanceRepository {
  async getChildAttendance(
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<Record<string, number>> {
    const recordsSnapshot = await db
      .collection("attendance")
      .doc(childId)
      .collection("records")
      .where(FieldPath.documentId(), ">=", startDate)
      .where(FieldPath.documentId(), "<=", endDate)
      .get();

    const statusCount: Record<string, number> = {
      present: 0,
      absent: 0,
    };

    recordsSnapshot.forEach((doc) => {
      const status = doc.data().status;
      if (status === "present" || status === "absent") {
        statusCount[status]++;
      }
    });

    return statusCount;
  }
}
