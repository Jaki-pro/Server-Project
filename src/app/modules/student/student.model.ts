import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: { type: 'string', required: true },
  middleName: { type: 'string' },
  lastName: { type: 'string', required: true },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: 'string', required: true },
  fatherContactNo: { type: 'string', required: true },
  fatherOccupation: { type: 'string', required: true },
  motherName: { type: 'string', required: true },
  motherContactNo: { type: 'string', required: true },
  motherOccupation: { type: 'string', required: true },
});
const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: 'string', required: true },
  occupation: { type: 'string', required: true },
  contactNo: { type: 'string', required: true },
  address: { type: 'string', required: true },
});
const studentSchema = new Schema<Student>({
  id: { type: 'string' },
  name: userNameSchema,
  gender: ['male', 'female'],
  email: { type: 'string', required: true },
  dateOfBirth: { type: 'string' },
  contactNo: { type: 'string', required: true },
  emergencyContactNo: { type: 'string', required: true },
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  presentAddress: { type: 'string', required: true },
  permanentAddress: { type: 'string', required: true },
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImg: { type: 'string' },
  isActive: ['active', 'inactive'],
});
export const StudentModel = model<Student>('Student', studentSchema);
