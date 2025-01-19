import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import QueryBuiler from '../../builder/QueryBuilder';

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
  if (academicSemesterCodeMapper[payLoad.name] !== payLoad.code)
    throw new AppError(999, 'Invalid Semester Code');
  const result = await AcademicSemester.create(payLoad);
  return result;
};
const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicSemesterQuery = new QueryBuiler(
    AcademicSemester.find(),
    query,
  ).filter();
  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAcademicSemestersFromDB = async (academicSemesterId: string) => {
  const result = await AcademicSemester.findOne({ _id: academicSemesterId });
  return result;
};
const updateAcademicSemesterIntoDB = async (
  academicSemesterId: string,
  payLoad: Partial<TAcademicSemester>,
) => {
  if (
    payLoad.name &&
    payLoad.code &&
    academicSemesterCodeMapper[payLoad.name] !== payLoad.code
  ) {
    throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Invalid Semester Code');
  }
  const result = await AcademicSemester.findByIdAndUpdate(
    { _id: academicSemesterId },
    payLoad,
    { new: true },
  );
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemestersFromDB,
  updateAcademicSemesterIntoDB,
};
