import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicSemesterCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payLoad: TAcademicSemester) => {
  if (academicSemesterCodeMapper[payLoad.name] !== payLoad.code)
    throw new AppError(999, 'Invalid Semester Code');
  const result = await AcademicSemester.create(payLoad);
  return result;
};
const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
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
