import { z } from 'zod';

const createEnrolledValidationSchema = z.object({
  body: z.object({
    offeredCourse: z.string(),
  }),
});
const updateEnrolledCourseMarksValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string({
      required_error: 'semesterRegistration is required',
    }),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number(),
      midTerm: z.number(),
      classTest2: z.number(),
      finalTerm: z.number(),
    }),
  }),
});
export const EnrolledCourseValidatins = {
  createEnrolledValidationSchema,
  updateEnrolledCourseMarksValidationSchema,
};
