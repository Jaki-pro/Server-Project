import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { TFaculty, TUserName } from './faculty.interface';
import AppError from '../../errors/AppError';
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    maxlength: [20, 'Maximum length cannot be more than 20 characters'],
    trim: true,
    // Custom validator
    // validate: {
    //   validator: function (value: string) {
    //     const str =
    //       value.charAt(0).toUpperCase() + value.slice(1, value.length);
    //     return value === str;
    //   },
    //   message: '{VALUE} is not Capitalized',
    // },
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
});

const facultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'Student ID is required'],
      unique: true,
      ref: 'User',
    },
    designation: { type: String, required: true },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          '{VALUE} is not a valid gender. Gender can only be one of the following: male, female, other',
      },
      required: [true, 'Gender is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    dateOfBirth: {
      type: String,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is required'],
    },
    profileImg: {
      type: String,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // toJSON: {
    //   virtuals: true,
    // },
    timestamps: true,
  },
);

//Query Middleware
// Pre hook/middleware
facultySchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//Pre hook for single find
facultySchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
export const Faculty = model<TFaculty>('Faculty', facultySchema);
