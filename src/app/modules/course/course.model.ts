import { Schema, Types, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';
import { ref } from 'joi';
const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', unique: true },
  isDeleted: { type: Boolean, default: false },
});
const courseSchema = new Schema<TCourse>({
  title: { type: String, required: true, trim: true, unique: true },
  prefix: { type: String, trim: true, required: true },
  code: { type: Number, trim: true, required: true },
  credits: { type: Number, trim: true, required: true },
  isDeleted: { type: Boolean, default: false },
  preRequisiteCourse: { type: [preRequisiteCoursesSchema], _id: false },
});

courseSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
courseSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: { type: Schema.Types.ObjectId, unique: true, ref: 'Course' },
  faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
});
export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
