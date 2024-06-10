import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constants';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: 'string',
      enum: AcademicSemesterName,
      required: true,
    },
    year: { type: String, required: true },
    code: { type: 'string', enum: AcademicSemesterCode, required: true },
    startMonth: { type: 'string', enum: Months, required: true },
    endMonth: { type: 'string', enum: Months, required: true },
  },
  {
    timestamps: true,
  },
);
// pre document middleware
// check if semester is already exists or not
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemesterExists)
    throw new AppError(httpStatus.NOT_FOUND, 'Semester already exists');
  next();
});
export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
