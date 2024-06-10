import mongoose from 'mongoose';
import QueryBuiler from '../../builder/QueryBuilder';
import { adminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuiler(Admin.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await adminQuery.modelQuery;
  return result;
};

const getSingleAdminFromDB = async (
  id: string,
  query: Record<string, unknown>,
) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...primitiveFields } = payload;
  const modifiedUpdatedData: Record<string, unknown> = { ...primitiveFields };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  //   console.log(modifiedUpdatedData);
  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

// DELETE Admin
const deleteAdminFromDB = async (id: string) => {
  // Transaction and Rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin');
    }
    const deletedUser = await User.findByIdAndUpdate(
      deletedAdmin.user,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin');
  }
};
export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
