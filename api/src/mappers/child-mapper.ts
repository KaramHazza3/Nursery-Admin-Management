import {
  AllChildrenResponse,
  ChildWithParentResponseDto,
  ParentUser,
} from "@/types";
import { Timestamp } from "firebase-admin/firestore";

function toDate(value: any): Date | undefined {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === "string" || value instanceof Date)
    return new Date(value);
  return undefined;
}

export const mapChildSnapshotToResponse = (
  id: string,
  name: string,
  dob: string
): AllChildrenResponse => {
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  return {
    id,
    name,
    age,
  };
};

export const mapChildWithParent = (
  childData: any,
  parentData: ParentUser
): ChildWithParentResponseDto => {
  const { linkedChildren, ...cleanedParent } = parentData;

  return {
    ...childData,
    createdAt: toDate(childData.createdAt),
    updatedAt: toDate(childData.updatedAt),
    parent: {
      ...cleanedParent,
      createdAt: toDate(cleanedParent.createdAt),
      updatedAt: toDate(cleanedParent.updatedAt),
    },
  };
}
