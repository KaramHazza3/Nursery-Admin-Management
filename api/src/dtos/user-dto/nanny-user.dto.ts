import { NannyUserSchema, UpdateNanny } from '@/schemas';

export const CreateNannyDto = NannyUserSchema;
export const NannyUserResponseDto = NannyUserSchema.omit({password: true});
export const UpdateNannyDto = UpdateNanny;