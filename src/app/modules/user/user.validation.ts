import { z } from 'zod';
export const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .max(20, { message: 'password cannot be more than 20 characters' })
    .optional(),
});
