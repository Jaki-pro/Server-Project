import { z } from 'zod';

// Define Zod schema for the user name
const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: 'Maximum length cannot be more than 20 characters' })
    .regex(/^[A-Za-z\s]*$/, {
      message: 'First Name should contain alphabetic characters only',
    })
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'First Name is required',
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last Name is required' })
    .regex(/^[A-Za-z\s]*$/, {
      message: 'Last Name should contain alphabetic characters only',
    }),
});
// Define Zod schema for the guardian
const createGuardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father Name is required' }),
  fatherContactNo: z
    .string()
    .min(1, { message: 'Father Contact Number is required' }),
  fatherOccupation: z
    .string()
    .min(1, { message: 'Father Occupation is required' }),
  motherName: z.string().min(1, { message: 'Mother Name is required' }),
  motherContactNo: z
    .string()
    .min(1, { message: 'Mother Contact Number is required' }),
  motherOccupation: z
    .string()
    .min(1, { message: 'Mother Occupation is required' }),
});

// Define Zod schema for the local guardian
const createLocalGaurdianValidationSchema = z.object({
  name: z.string().min(1, { message: 'Local Guardian Name is required' }),
  occupation: z
    .string()
    .min(1, { message: 'Local Guardian Occupation is required' }),
  contactNo: z
    .string()
    .min(1, { message: 'Local Guardian Contact Number is required' }),
  address: z.string().min(1, { message: 'Local Guardian Address is required' }),
});

// Define Zod schema for the student
export const createStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      email: z.string().email(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().min(1, { message: 'Contact Number is required' }),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency Contact Number is required' }),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present Address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent Address is required' }),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGaurdianValidationSchema,
      profileImg: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      isActive: z.enum(['active', 'inactive']),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

//for update
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: 'Maximum length cannot be more than 20 characters' })
    .regex(/^[A-Za-z\s]*$/, {
      message: 'First Name should contain alphabetic characters only',
    })
    .refine((val) => val !== undefined && val !== null && val !== '', {
      message: 'First Name is required',
    })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: 'Last Name is required' })
    .regex(/^[A-Za-z\s]*$/, {
      message: 'Last Name should contain alphabetic characters only',
    })
    .optional(),
});
// Define Zod schema for the guardian
const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1, { message: 'Father Name is required' })
    .optional(),
  fatherContactNo: z
    .string()
    .min(1, { message: 'Father Contact Number is required' })
    .optional(),
  fatherOccupation: z
    .string()
    .min(1, { message: 'Father Occupation is required' })
    .optional(),
  motherName: z
    .string()
    .min(1, { message: 'Mother Name is required' })
    .optional(),
  motherContactNo: z
    .string()
    .min(1, { message: 'Mother Contact Number is required' })
    .optional(),
  motherOccupation: z
    .string()
    .min(1, { message: 'Mother Occupation is required' })
    .optional(),
});

// Define Zod schema for the local guardian
const updateLocalGaurdianValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Local Guardian Name is required' })
    .optional(),
  occupation: z
    .string()
    .min(1, { message: 'Local Guardian Occupation is required' })
    .optional(),
  contactNo: z
    .string()
    .min(1, { message: 'Local Guardian Contact Number is required' })
    .optional(),
  address: z
    .string()
    .min(1, { message: 'Local Guardian Address is required' })
    .optional(),
});
export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      email: z.string().email().optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z
        .string()
        .min(1, { message: 'Contact Number is required' })
        .optional(),
      emergencyContactNo: z
        .string()
        .min(1, { message: 'Emergency Contact Number is required' })
        .optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z
        .string()
        .min(1, { message: 'Present Address is required' })
        .optional(),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent Address is required' })
        .optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGaurdianValidationSchema.optional(),
      profileImg: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      isActive: z.enum(['active', 'inactive']).optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
