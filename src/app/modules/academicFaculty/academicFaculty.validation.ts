import { z } from 'zod';
const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be a string',
    }),
  }),
});
const updateAdemicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be a string',
    }),
  }),
});
export const academicFacultyValidations = {
  createAcademicFacultyValidationSchema,
  updateAdemicFacultyValidationSchema,
};
