import { NannyUserSchema } from "@/schemas";
import { NannyUserResponse } from "@/types/user.type";

export const mapDocToNanny = (
  data: FirebaseFirestore.DocumentData
): NannyUserResponse => {
  return NannyUserSchema.parse({
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(0),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(0),
  });
};