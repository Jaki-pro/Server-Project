import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { EnrolledCourse } from './enrolledCourse.model';
import { Student } from '../student/student.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  // check if the offered course exists
  // check if the student already enrolled
  // create enrolled course
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }
  const student = await Student.findOne({ id: userId }).select('_id');
  if (!student) throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    offeredCourse,
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student already enrolled');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full');
  }
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
  ]);
  const course = await Course.findById(isOfferedCourseExists?.course);
  const totalEnrolledCredits = enrolledCourses[0].totalEnrolledCredits;
  const newEnrolledCredits = course?.credits;
  if (
    semesterRegistration &&
    totalEnrolledCredits + newEnrolledCredits > semesterRegistration?.maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded the maximum number of credits available',
    );
  }

  payload.semesterRegistration = isOfferedCourseExists?.semesterRegistration;
  payload.academicSemester = isOfferedCourseExists?.academicSemester;
  payload.faculty = isOfferedCourseExists?.faculty;
  payload.academicFaculty = isOfferedCourseExists?.academicFaculty;
  payload.academicDepartment = isOfferedCourseExists?.academicDepartment;
  payload.course = isOfferedCourseExists?.course;
  payload.student = student?._id;
  payload.isEnrolled = true;
  const result = await EnrolledCourse.create(payload);
  if (!result)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Enroll course');
  await OfferedCourse.findByIdAndUpdate(
    offeredCourse,
    {
      $inc: { maxCapacity: -1 },
    },
    { new: true },
  );
  return result;
};
const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  const isCourseBelongToFaculty = await EnrolledCourse.findOne(
    {
      semesterRegistration,
      offeredCourse,
      student,
      faculty: faculty._id,
    },
    { _id: 1, courseMarks: 1 },
  );
  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are Forbidden');
  }
  let modifiedData: Record<string, unknown> = { ...courseMarks };
  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm } =
      isCourseBelongToFaculty?.courseMarks;
    const totalMarks =
      classTest1 + classTest2 + midTerm + courseMarks.finalTerm;

    const result = calculateGradeAndPoints(totalMarks);
    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }
  // DYNAMIC FIELD UPDATE
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true, runValidators: true },
  );

  return result;
};
export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
