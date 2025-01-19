import jwt, { JwtPayload } from 'jsonwebtoken';
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
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';
import { TAdmin } from '../admin/admin.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// CREATE Student
const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  // If password is not provided then use default password
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'student';
  userData.email = payload.email;
  // set generated ID
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  //start a session
  const session = await mongoose.startSession();
  try {
    //start a transaction
    session.startTransaction();
    // console.log('ok from service', file);
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );
    // console.log(userData);
    // Send Image to cloudinary
    const imageName = `${userData.id}${payload?.name?.firstName}`;
    // console.log('imageName', imageName);
    const uploadResult = await sendImageToCloudinary(imageName, file?.path);
    //create a user (transaction-1)
    // console.log('upload result', uploadResult?.secure_url);
    const newUser = await User.create([userData], { session }); // builtin static method
    if (!newUser.length) {
      throw new Error('Failed to create user');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference ID
    payload.profileImg = uploadResult?.secure_url;
    // create a student (taransaction -2)
    // console.log('payload', payload);
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new Error('Failed to create student');
    }
    await session.commitTransaction(); // successful-commit transation
    await session.endSession(); // End transaction
    return newStudent;
  } catch (err) {
    await session.abortTransaction(); // Error in transaction-so abort
    await session.endSession(); // End transaction
    throw new Error('Failed too create student');
  }
};

// CREATE Faculty
const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // If password is not provided then use default password
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'faculty';
  userData.email = payload.email;

  //start a session
  const session = await mongoose.startSession();
  try {
    //start a transaction
    session.startTransaction();
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
  userData.email = payload.email;
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

const getMe = async (userData: JwtPayload) => {
  let result = null;

  if (userData.role === 'student') {
    result = await Student.findOne({ id: userData.userId });
  } else if (userData.role === 'faculty') {
    result = await Faculty.findOne({ id: userData.userId });
  } else if (userData.role === 'admin') {
    result = await Admin.findOne({ id: userData.userId });
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  console.log(id);
  return result;
};
export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
