import QueryBuiler from '../../builder/QueryBuilder';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};
const getAllAcademicFacultiesFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicFacultyQuery = new QueryBuiler(
    AcademicFaculty.find(),
    query,
  ).filter();
  const result = await academicFacultyQuery.modelQuery;
  const meta = await academicFacultyQuery.countTotal();
  return {
    meta,
    result,
  };
};
const getSingleAcademicFacultyFromDB = async (Id: string) => {
  const result = await AcademicFaculty.find({ _id: Id });
  return result;
};
const updateAcademicFacultyIntoDB = async (
  Id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: Id }, payload, {
    new: true,
  });
  return result;
};
export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
