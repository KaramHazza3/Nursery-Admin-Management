import { strictObject, z } from "zod";

const PersonalInfoSchema = strictObject({
  childName: z.string(),
  dob: z.string(),
  gender: z.string(),
  idNumber: z.string(),
  imagePath: z.string().optional(),
  bio: z.string(),
});

const DailyScheduleSchema = strictObject({
  arrivalTime: z.string(),
  departureTime: z.string(),
});

const DietaryInfoSchema = strictObject({
  avoidsSpecificFoods: z.boolean(),
  foodRestrictions: z.string().optional(),
});

const HealthDataSchema = strictObject({
  activityLimitations: z.string(),
  allergies: z.string(),
  breastfed: z.boolean(),
  currentMedications: z.string().optional(),
  healthConditions: z.string().optional(),
  naturalBirth: z.boolean(),
  pastAccidents: z.string().optional(),
  pottyTrained: z.boolean(),
  vaccinationsUpToDate: z.boolean().optional(),
});

const LivesWithOtherChildrenSchema = strictObject({
  status: z.boolean(),
  details: z.string().optional(),
});

const SiblingsCountSchema = strictObject({
  boys: z.number(),
  girls: z.number(),
});

export const ChildSchema = strictObject({
  classId: z.string(),
  parentId: z.string().optional(),
  createdAt: z.date().optional(),
  additionalNotes: z.string(),

  personalInfo: PersonalInfoSchema,
  dailySchedule: DailyScheduleSchema,
  dietaryInfo: DietaryInfoSchema,
  healthData: HealthDataSchema,
  livesWithOtherChildren: LivesWithOtherChildrenSchema,
  siblingsCount: SiblingsCountSchema,
  status: z.string(),
});

const PersonalInfoUpdateSchema = PersonalInfoSchema.partial();
const DailyScheduleUpdateSchema = DailyScheduleSchema.partial();
const DietaryInfoUpdateSchema = DietaryInfoSchema.partial();
const HealthDataUpdateSchema = HealthDataSchema.partial();
const LivesWithOtherChildrenUpdateSchema = LivesWithOtherChildrenSchema.partial();
const SiblingsCountUpdateSchema = SiblingsCountSchema.partial();

export const UpdateChildSchema = strictObject({
  classId: z.string().optional(),
  parentId: z.string().optional(),
  createdAt: z.date().optional(),
  additionalNotes: z.string().optional(),
  status: z.string().optional(),

  personalInfo: PersonalInfoUpdateSchema.optional(),
  dailySchedule: DailyScheduleUpdateSchema.optional(),
  dietaryInfo: DietaryInfoUpdateSchema.optional(),
  healthData: HealthDataUpdateSchema.optional(),
  livesWithOtherChildren: LivesWithOtherChildrenUpdateSchema.optional(),
  siblingsCount: SiblingsCountUpdateSchema.optional(),
});