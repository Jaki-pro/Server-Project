import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Faculty } from '../faculty/faculty.model';
import { User } from './user.model';
const findLastStudentById = async (payload: TAcademicSemester) => {
  // console.log(payload);
  const lastStudent = await User.findOne(
    { role: 'student', id: { $regex: `^${payload.year}${payload.code}` } },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};
const findLastFacultyById = async () => {
  const lastFaculty = await User.findOne(
    { role: 'faculty' },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};
const findLastAdminById = async () => {
  const lastAdmin = await User.findOne(
    { role: 'admin' },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};
export const generateAdminId = async () => {
  const currentId = (await findLastAdminById()) || (0).toString();
  // console.log(currentId);
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `A-${incrementId}`;
};
export const generateFacultyId = async () => {
  const currentId = (await findLastFacultyById()) || (0).toString();
  // console.log(currentId);
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `F-${incrementId}`;
};
export const generateStudentId = async (payload: TAcademicSemester) => {
  const currentId = (await findLastStudentById(payload)) || (0).toString();
  console.log('gen');
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  return `${payload.year}${payload.code}${incrementId}`;
};
