import { SemesterRegistration } from './../semesterRegistration/semesterRegistration.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import QueryBuiler from '../../builder/QueryBuilder';

// Create OfferedCourse
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // check if the semeter registration exists
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Semester Registration not found',
    );
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }

  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isFacutlytExists = await Faculty.findById(faculty);
  if (!isFacutlytExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  // Check if Academic Department belongs to Academic Faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists?.name} doesnot belong to ${isAcademicFacultyExists?.name}`,
    );
  }

  // Check if same offered course with same registered semester is of same section
  const isSameOfferedCourseWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      SemesterRegistration,
      course,
      section,
    });
  if (isSameOfferedCourseWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists?.name} with secton ${section} is already exists}`,
    );
  }
  // Get the filter schedules of the faculties
  const assignedScedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime days');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedScedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The time is conflicting with another scheduled. Choose a different schedule`,
    );
  }

  const academicSemester = isSemesterRegistrationExists?.academicSemester;
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

// Get all OfferedCourse

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuiler(
    OfferedCourse.find(),
    query,
  ).filter();
  const result = await offeredCourseQuery.modelQuery;
  return result;
};

// Get all offered courses
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

//Delete offeredCourse from database
const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select('status');
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot Delete! This semester registration is ${semesterRegistrationStatus?.status}`,
    );
  }
  const result = await OfferedCourse.findByIdAndDelete(id);
  return await OfferedCourse.findById(id);
};

// Update OfferedCourse
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'startTime' | 'days' | 'endTime'>,
) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const { faculty, days, startTime, endTime } = payload;
  const isFacutlytExists = await Faculty.findById(faculty);
  if (!isFacutlytExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration);
  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot update! This semester registration is ${semesterRegistrationStatus?.status}`,
    );
  }
  // Get the filter schedules of the faculties
  const assignedScedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
    _id: { $ne: id },
  }).select('startTime endTime days');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasTimeConflict(assignedScedules, newSchedule)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The time is conflicting with another scheduled. Choose a different schedule`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
