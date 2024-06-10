import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';
import { TAdmin } from '../admin/admin.interface';

// CREATE Student
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // If password is not provided then use default password
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'student';
  // set generated ID
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  //start a session
  const session = await mongoose.startSession();
  try {
    //start a transaction
    await session.startTransaction();
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );
    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // builtin static method
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference ID
    // create a student (taransaction -2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new Error('Failed to create student');
    }
    await session.commitTransaction(); // successful-commit transation
    await session.endSession(); // End transaction
    return newStudent;
  } catch (err) {
    console.log('hi');
    await session.abortTransaction(); // Error in transaction-so abort
    await session.endSession(); // End transaction
    throw new Error('Failed to create student');
  }
};

// CREATE Faculty
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // If password is not provided then use default password
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'faculty';

  //start a session
  const session = await mongoose.startSession();
  try {
    //start a transaction
    await session.startTransaction();
    userData.id = await generateFacultyId();
    //create a user (transaction-1)
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference ID
    // create a faculty (taransaction -2)
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new Error('Failed to create Faculty');
    }
    await session.commitTransaction(); // successful-commit transation
    await session.endSession(); // End transaction
    return newFaculty;
  } catch (err) {
    await session.abortTransaction(); // Error in transaction-so abort
    await session.endSession(); // End transaction
    throw new Error('Failed to create Faculty');
  }
};

// CREATE Admin
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // If password is not provided then use default password
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'admin';

  //start a session
  const session = await mongoose.startSession();
  try {
    //start a transaction
    await session.startTransaction();
    userData.id = await generateAdminId();
    //create a user (transaction-1)
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference ID
    // create a Admin (taransaction -2)
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new Error('Failed to create Admin');
    }
    await session.commitTransaction(); // successful-commit transation
    await session.endSession(); // End transaction
    return newAdmin;
  } catch (err) {
    await session.abortTransaction(); // Error in transaction-so abort
    await session.endSession(); // End transaction
    throw new Error('Failed to create Admin');
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
