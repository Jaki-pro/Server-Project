import { trim } from 'validator';
import { Faculty } from './faculty.model';
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

// Define Zod schema for the student
export const createFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        message: 'Gender must be either male or female or other',
      }),
      designation: z.string().refine((value) => trim(value)),
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
      profileImg: z.string().optional(),
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

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z
        .enum(['male', 'female', 'other'], {
          message: 'Gender must be either male or female or other',
        })
        .refine((value) => trim(value))
        .optional(),
      designation: z.string().optional(),
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
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
      isActive: z.enum(['active', 'inactive']).optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
