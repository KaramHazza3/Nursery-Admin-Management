import { auth, db } from "@/config/firebaseAdmin";
import {
  NannyUserResponse,
  ViewParentUserResponseDto,
  UpdateNannyDto,
  User,
  UpdateParentDto,
  ParentUser,
} from "@/types";
import { injectable } from "tsyringe";
import { UserNotFound } from "@/exceptions/userNotFound";
import { firestore } from "firebase-admin";
import { IUserRepository } from "../intf/IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  async removeChildFromParent(
    parentId: string,
    childId: string
  ): Promise<void> {
    await db
      .collection("users")
      .doc(parentId)
      .update({
        linkedChildren: firestore.FieldValue.arrayRemove(childId),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }
  async addNannyToClasses(nannyId: string, classIds: string[]): Promise<void> {
    if (classIds.length === 0) return;
    await db
      .collection("users")
      .doc(nannyId)
      .update({
        linkedClasses: firestore.FieldValue.arrayUnion(...classIds),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async removeNannyFromClasses(
    nannyId: string,
    classIds: string[]
  ): Promise<void> {
    if (classIds.length === 0) return;
    await db
      .collection("users")
      .doc(nannyId)
      .update({
        linkedClasses: firestore.FieldValue.arrayRemove(...classIds),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  async getParentByIdRaw(parentId: string): Promise<ParentUser | null> {
    const doc = await db.collection("users").doc(parentId).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as ParentUser;
  }

  async getAllParents(): Promise<ViewParentUserResponseDto[]> {
    const snapshot = await db
      .collection("users")
      .where("role", "==", "parent")
      .get();

    if (snapshot.empty) return [];
    const parents: ViewParentUserResponseDto[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const relation = data.relation ?? "";
      let fullName = "";
      let mobile = "";
      if (relation === "mother") {
        fullName = data.mother?.fullName ?? "";
        mobile = data.mother?.mobile ?? "";
      } else if (relation === "father") {
        fullName = data.father?.fullName ?? "";
        mobile = data.father?.mobile ?? "";
      }
      parents.push({
        uid: doc.id,
        relation,
        fullName,
        mobile,
        numOfChildren: data.linkedChildren?.length ?? 0,
      });
    });
    return parents;
  }

  async getAllNannyNames(): Promise<string[]> {
    const snapshot = await db
      .collection("users")
      .where("role", "==", "nanny")
      .select("personalInfo.fullName")
      .get();
    const names: string[] = [];
    snapshot.forEach((doc) => {
      const name = doc.data()?.personalInfo?.fullName;
      if (name) names.push(name);
    });
    return names;
  }

  async getNannyIdsFromNames(nannyNames: string[]): Promise<string[]> {
    const matchedNannyIds: string[] = [];
    for (const name of nannyNames) {
      const snapshot = await db
        .collection("users")
        .where("role", "==", "nanny")
        .where("personalInfo.fullName", "==", name)
        .get();
      snapshot.forEach((doc) => matchedNannyIds.push(doc.id));
    }
    return matchedNannyIds;
  }

  async getAllNannies(): Promise<
    { uid: string; data: FirebaseFirestore.DocumentData }[]
  > {
    const snapshot = await db
      .collection("users")
      .where("role", "==", "nanny")
      .get();
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      data: doc.data(),
    }));
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as User;
  }

  async getUserById(uid: string): Promise<User | null> {
    const docSnap = await db.collection("users").doc(uid).get();
    if (!docSnap.exists) return null;
    return { uid: docSnap.id, ...docSnap.data() } as User;
  }

  async deleteUserById(uid: string): Promise<void> {
    await auth.deleteUser(uid);
    await db.collection("users").doc(uid).delete();
  }

  async createUser<TInput extends object, TReturn extends object>(
    uid: string,
    payload: TInput
  ): Promise<TReturn> {
    const userDocRef = db.collection("users").doc(uid);
    const payloadWithUid = { uid, ...payload };
    await userDocRef.set(payloadWithUid);
    const userDocSnap = await userDocRef.get();
    return { uid: userDocSnap.id, ...userDocSnap.data() } as TReturn;
  }

  async editNanny(
    uid: string,
    editPayload: UpdateNannyDto
  ): Promise<NannyUserResponse> {
    const userRef = db.collection("users").doc(uid);
    const existingDoc = await userRef.get();
    if (!existingDoc.exists) throw new UserNotFound();

    const existingData = existingDoc.data() as Partial<NannyUserResponse>;
    const mergedData = {
      ...existingData,
      ...editPayload,
      personalInfo: {
        ...existingData.personalInfo,
        ...editPayload.personalInfo,
      },
      salaryInfo: { ...existingData.salaryInfo, ...editPayload.salaryInfo },
      privileges: { ...existingData.privileges, ...editPayload.privileges },
      updatedAt: new Date(),
    };

    await userRef.update(mergedData);
    const updatedDoc = await userRef.get();
    return { uid: updatedDoc.id, ...(updatedDoc.data() as NannyUserResponse) };
  }

  async editParent(
    uid: string,
    editPayload: UpdateParentDto
  ): Promise<ParentUser> {
    const userRef = db.collection("users").doc(uid);
    const existingDoc = await userRef.get();
    if (!existingDoc.exists) throw new UserNotFound();

    const existingData = existingDoc.data() as Partial<ParentUser>;
    const mergedData = {
      ...existingData,
      ...editPayload,
      father: { ...existingData.father, ...editPayload.father },
      mother: { ...existingData.mother, ...editPayload.mother },
      linkedChildren: Array.from(
        new Set([
          ...(existingData.linkedChildren ?? []),
          ...(editPayload.linkedChildren ?? []),
        ])
      ),
      updatedAt: new Date(),
    };

    await userRef.update(mergedData);
    const updatedDoc = await userRef.get();
    return { uid: updatedDoc.id, ...(updatedDoc.data() as ParentUser) };
  }

  async getNannyById(uid: string): Promise<NannyUserResponse | null> {
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as NannyUserResponse;
  }
}
