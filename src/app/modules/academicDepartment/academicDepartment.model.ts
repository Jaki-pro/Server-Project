import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: 'string', required: true, unique: true, trim: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// Handled using Duplicate Error also
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });
  if (isDepartmentExist) throw new AppError(404, 'Department already exists');
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const query = this.getQuery();
    await AcademicDepartment.findOne(query);
  } catch (err) {
    throw new AppError(404, 'This department does not exist! ');
  }

  next();
});
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
