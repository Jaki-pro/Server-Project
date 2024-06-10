import { populate } from 'dotenv';
import mongoose, { Query } from 'mongoose';
import QueryBuiler from '../../builder/QueryBuilder';
import { Faculty } from './faculty.model';
import { facultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuiler(
    Faculty.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate({
    path: 'academicDepartment',
    populate: { path: 'academicFaculty' },
  });
  return result;
};

// UPDATE Faculty
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...primitiveFields } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...primitiveFields };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  //   console.log(modifiedUpdatedData);
  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

// DELETE Faculty
const deleteFacultyFromDB = async (id: string) => {
  // Transaction and Rollback
  console.log(id);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty');
    }
    const deletedUser = await User.findByIdAndUpdate(
      deletedFaculty.user,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty');
  }
};
export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
