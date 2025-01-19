import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import { object } from 'joi';
import QueryBuiler from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // Searching
  // const searchTerm = query?.searchTerm || '';
  // const searchQuery = Student.find({
  //   $or: searchableFields.map((field) => ({
  //     [field]: {
  //       $regex: searchTerm,
  //       $options: 'i',
  //     },
  //   })),
  // });

  // //Filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((field) => delete queryObj[field]);
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate({ path: 'admissionSemester' })
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  //sorting
  // const sort = (query?.sort as string) || 'createdAt';
  // const sortQuery = filterQuery.sort(sort);
  // console.log(query);
  // // paging
  // const page = Number(query?.page) || 1;
  // const limit = Number(query?.limit) || 1;
  // const skip = (page - 1) * limit;
  // const paginateQuery = sortQuery.skip(skip);

  // // Limiting
  // const limitQuery = paginateQuery.limit(limit);
  // const fields = (query?.fields as string).split(',').join(' ') || '-__v';
  // //console.log({ fields });
  // const fieldQuery = await limitQuery.select(fields);
  // // select field
  // return fieldQuery;

  const studentQuery = new QueryBuiler(
    Student.find()
      .populate({ path: 'user' })
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  //const result = await Student.findOne({ id: id });
  const result = await Student.findById(id)
    .populate({ path: 'admissionSemester' })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...primitiveFields } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...primitiveFields };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  // console.log(modifiedUpdatedData);
  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    console.log(id);
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    // get user _id from deletedStudent
    const userId = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};
export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
