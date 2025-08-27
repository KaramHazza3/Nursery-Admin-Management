import { ChildResponseDto, CreateChildDto, UpdateChildDto } from "@/types";
import { IChildrenRepository } from "../intf/IChildrenRepository";
import { db } from "@/config/firebaseAdmin";
import { injectable } from "tsyringe";
import { firestore } from "firebase-admin";

@injectable()
export class ChildrenRepository implements IChildrenRepository {
  async editChild(childId: string, editPayload: UpdateChildDto): Promise<void> {
    const childRef = db.collection("children").doc(childId);
    const existingDoc = await childRef.get();

    const existingData = existingDoc.data() as Partial<ChildResponseDto>;

    const mergedData = {
      ...existingData,
      ...editPayload,
      personalInfo: {
        ...existingData.personalInfo,
        ...editPayload.personalInfo,
      },
      dailySchedule: {
        ...existingData.dailySchedule,
        ...editPayload.dailySchedule,
      },
      dietaryInfo: {
        ...existingData.dietaryInfo,
        ...editPayload.dietaryInfo,
      },
      healthData: {
        ...existingData.healthData,
        ...editPayload.healthData,
      },
      livesWithOtherChildren: {
        ...existingData.livesWithOtherChildren,
        ...editPayload.livesWithOtherChildren,
      },
      siblingsCount: {
        ...existingData.siblingsCount,
        ...editPayload.siblingsCount,
      },
      updatedAt: new Date(),
    };

    await childRef.update(mergedData);
  }
  async deleteChild(childId: string): Promise<void> {
    await db.collection("children").doc(childId).delete();
  }
  async getChildById(
    childId: string
  ): Promise<FirebaseFirestore.DocumentSnapshot> {
    return await db.collection("children").doc(childId).get();
  }
  async getAllChildrenRaw(): Promise<
    FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  > {
    return await db.collection("children").get();
  }

  async editChildClass(childId: string, editedClassId: string): Promise<void> {
    const docRef = db.collection("children").doc(childId);

    await docRef.update({
      classId: editedClassId,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  async deleteChildren(childIds: string[]): Promise<void> {
    const batchSize = 100;

    for (let i = 0; i < childIds.length; i += batchSize) {
      const batch = db.batch();
      const chunk = childIds.slice(i, i + batchSize);

      chunk.forEach((childId) => {
        const childRef = db.collection("children").doc(childId);
        batch.delete(childRef);
      });

      await batch.commit();
    }
  }

  async getChildIdFromName(childName: string): Promise<string | null> {
    const snapshot = await db
      .collection("children")
      .where("personalInfo.childName", "==", childName)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    return snapshot.docs[0].id;
  }

  async createChild(childPayload: CreateChildDto): Promise<string> {
    const child = await db.collection("children").add({
      ...childPayload,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return child.id;
  }

  async getChildrenByParentId(
    parentId: string
  ): Promise<{ id: string; name: string }[]> {
    const snapshot = await db
      .collection("children")
      .where("parentId", "==", parentId)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.personalInfo.childName,
      };
    });
  }

  async getChildrenDocsByIds(
    childIds: string[]
  ): Promise<FirebaseFirestore.DocumentSnapshot[]> {
    const snapshot = await db
      .collection("children")
      .where(firestore.FieldPath.documentId(), "in", childIds)
      .get();

    return snapshot.empty ? [] : snapshot.docs;
  }

  async getChildrenIdsByClassId(classId: string): Promise<string[]> {
    const snapshot = await db
      .collection("children")
      .where("classId", "==", classId)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => doc.id);
  }
}
