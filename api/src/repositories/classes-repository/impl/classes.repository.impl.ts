import { db } from "@/config/firebaseAdmin";
import { IClassesRepository } from "../intf/IClassesRepository";
import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { injectable } from "tsyringe";
import { chunkArray } from "@/utils/array";

@injectable()
export class ClassesRepository implements IClassesRepository {
  async getClassNamesByIds(
    classIds: string[]
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    if (classIds.length === 0) return result;

    const chunks = chunkArray(classIds, 10);
    for (const chunk of chunks) {
      const snapshot = await db
        .collection("classes")
        .where(firestore.FieldPath.documentId(), "in", chunk)
        .select("name")
        .get();

      snapshot.forEach((doc) => {
        result[doc.id] = doc.data().name;
      });
    }

    return result;
  }
  async deleteClass(classId: string): Promise<void> {
    await db.collection("classes").doc(classId).delete();
  }
  async getClassDocById(
    classId: string
  ): Promise<FirebaseFirestore.DocumentSnapshot | null> {
    const docSnap = await db.collection("classes").doc(classId).get();
    return docSnap.exists ? docSnap : null;
  }

  async getNannyDocsByIds(
    nannyIds: string[]
  ): Promise<FirebaseFirestore.DocumentSnapshot[]> {
    const snapshot = await db
      .collection("users")
      .where(firestore.FieldPath.documentId(), "in", nannyIds)
      .where("role", "==", "nanny")
      .get();

    return snapshot.empty ? [] : snapshot.docs;
  }

  async getAllClassDocs() {
    return await db.collection("classes").get();
  }

  async editClass(
    classId: string,
    updates: Record<string, any>
  ): Promise<void> {
    const classRef = db.collection("classes").doc(classId);
    await classRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async createClassWithNannies(
    className: string,
    nanniesIds: string[]
  ): Promise<string> {
    const docRef = await db.collection("classes").add({
      name: className,
      nannyIds: nanniesIds,
      childIds: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return docRef.id;
  }

  async addChildToClass(childId: string, classId: string): Promise<void> {
    const classRef = db.collection("classes").doc(classId);
    await classRef.update({
      childIds: firestore.FieldValue.arrayUnion(childId),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async deleteChildFromClass(classId: string, childId: string): Promise<void> {
    const classRef = db.collection("classes").doc(classId);
    await classRef.update({
      childIds: firestore.FieldValue.arrayRemove(childId),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async addNannyToClasses(nannyId: string, classIds: string[]): Promise<void> {
    const batch = db.batch();
    classIds.forEach((classId) => {
      const classRef = db.collection("classes").doc(classId);
      batch.update(classRef, {
        nannyIds: firestore.FieldValue.arrayUnion(nannyId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  }

  async removeNannyFromClasses(
    nannyId: string,
    classIds: string[]
  ): Promise<void> {
    const batch = db.batch();
    classIds.forEach((classId) => {
      const classRef = db.collection("classes").doc(classId);
      batch.update(classRef, {
        nannyIds: firestore.FieldValue.arrayRemove(nannyId),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();
  }

  async getNanniesFromClass(classId: string): Promise<string[]> {
    const docSnap = await db.collection("classes").doc(classId).get();
    if (!docSnap.exists) {
      throw new Error(`Class with ID ${classId} not found`);
    }
    return docSnap.data()?.nannyIds ?? [];
  }

  async getClassIdsByNames(names: string[]): Promise<string[]> {
    const snapshot = await db
      .collection("classes")
      .where("name", "in", names)
      .get();
    return snapshot.docs.map((doc) => doc.id);
  }

  async removeDeletedChildIdsFromClasses(
    childIdsToRemove: string[]
  ): Promise<void> {
    const classesRef = db.collection("classes");

    for (const childId of childIdsToRemove) {
      const snapshot = await classesRef
        .where("childIds", "array-contains", childId)
        .get();
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          childIds: firestore.FieldValue.arrayRemove(childId),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
    }
  }
}
