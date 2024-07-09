import { z } from 'zod';
const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Name must be a string' })
    .max(20, { message: 'password cannot be more than 20 characters' })
    .optional(),
});
export const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
