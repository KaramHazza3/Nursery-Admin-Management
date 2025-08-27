import { strictObject, z } from "zod";
import { ChildSchema } from "./child.schema";

const EmergencyContactSchema = strictObject({
  name: z.string(),
  phone: z.string(),
  relation: z.string(),
});

const PersonalInfo = strictObject({
  address: z.string(),
  bio: z.string(),
  dob: z.string(),
  educationLevel: z.string(),
  experience: z.string(),
  certifications: z.array(z.string()),
  fullName: z.string(),
  gender: z.string(),
  imagePath: z.string(),
  languages: z.array(z.string()),
  mobile: z.string(),
});

const privilegesSchema = strictObject({
  canAccessCameras: z.boolean(),
  canAddActivity: z.boolean(),
  canAddNotes: z.boolean(),
  canSendNotifications: z.boolean(),
  canUpdateChildrenStatus: z.boolean(),
  canTakeAttendance: z.boolean(),
});

const ParentInfoSchema = strictObject({
  dob: z.string(),
  educationLevel: z.string(),
  fullName: z.string(),
  jobLocation: z.string(),
  jobTitle: z.string(),
  mobile: z.string(),
  telPhone: z.string(),
});

const SalaryInfoSchema = strictObject({
  salary: z.number(),
  rewards: z.number(),
  extraHours: z.number(),
  finalSalary: z.number(),
});

const UserRoleSchema = z.enum(["parent", "nanny"]);

const BaseUserSchema = strictObject({
  uid: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: UserRoleSchema,
});

export const ParentUserSchema = BaseUserSchema.extend({
  relation: z.string().optional(),
  role: z.literal("parent").optional(),
  father: ParentInfoSchema,
  mother: ParentInfoSchema,
  linkedChildren: z.array(z.string()).optional(),
  emergencyContacts: z.array(EmergencyContactSchema).optional(),
});

export const NannyUserSchema = BaseUserSchema.extend({
  password: z.string().optional(),
  role: z.literal("nanny").optional(),
  personalInfo: PersonalInfo,
  privileges: privilegesSchema,
  salaryInfo: SalaryInfoSchema,
  linkedClasses: z.array(z.string()),
});

export const AdminUserSchema = strictObject({
  uid: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  role: z.literal("admin").optional(),
  created_at: z.date().optional(),
});

export const UserSchema = z.union([
  ParentUserSchema,
  NannyUserSchema,
  AdminUserSchema,
]);

const ParentInfoWithCredentialsSchema = ParentInfoSchema.extend({
  email: z.string().email(),
  password: z.string(),
});

export const ParentWithChildrenSchema = ParentUserSchema.omit({
  linkedChildren: true,
  father: true,
  mother: true,
  email: true,
}).extend({
  relation: z.string(),
  linkedChildren: z.array(ChildSchema),
  father: ParentInfoWithCredentialsSchema,
  mother: ParentInfoWithCredentialsSchema,
});

export const UpdateNanny = NannyUserSchema.extend({
  personalInfo: PersonalInfo.partial().optional(),
  privileges: privilegesSchema.partial().optional(),
  salaryInfo: SalaryInfoSchema.partial().optional(),
  linkedClasses: z.array(z.string()).optional(),
}).partial();
