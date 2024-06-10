import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuiler from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  // check if there is any registered semester that is 'UPCOMING' | 'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }

  //check if the semester exists
  const isAcademicSemeterExists = await AcademicSemester.findById(
    payload?.academicSemester,
  );
  if (!isAcademicSemeterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Academic Semester not found',
    );
  }
  //check if semester registration already exists
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester Registration already exists',
    );
  }
  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuiler(
    SemesterRegistration.find().populate({ path: 'academicSemester' }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if semester registration already registered

  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration is not found',
    );
  }
  // if the Requested Semester registration is Ended, we will not update anything
  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Semester Registration is already Ended',
    );
  }
  // UPCOMING -> ONGOING -> ENDED
  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot directly change status UPCOMING to ENDED',
    );
  }
  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot directly change status ONGOING to UPCOMING',
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteSemesterRegistrationIntoDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const semesterRegistrationStatus = await SemesterRegistration.findById(id, {
      session,
    }).select('status');
    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You cannot delete a Semester Registration that is not UPCOMING',
      );
    }
    const deleteOfferedCourses = await OfferedCourse.deleteMany(
      { semesterRegistration: id },
      { session },
    );
    if (!deleteOfferedCourses) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete Offered Courses',
      );
    }
    const deleteSemesterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, { session });
    if (!deleteSemesterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete Semester Registration',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return await SemesterRegistration.findById(id);
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete Semester Registration',
    );
  }
};
export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationIntoDB,
};
