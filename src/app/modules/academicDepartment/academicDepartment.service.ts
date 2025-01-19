import { Query } from 'mongoose';
import QueryBuiler from '../../builder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};
const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicDepartmentQuery = new QueryBuiler(
    AcademicDepartment.find(),
    query,
  ).filter();
  const result = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAcademicDepartmentFromDB = async (Id: string) => {
  const result = await AcademicDepartment.findOne({ _id: Id }).populate(
    'academicFaculty',
  );
  return result;
};
const updateAcademicDepartmentIntoDB = async (
  Id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: Id },
    payload,
    {
      new: true,
    },
  );
  return result;
};
export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
