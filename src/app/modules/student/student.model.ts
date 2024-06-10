import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  //StudentMethods,
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
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
    //Custom validator
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not Alphabetic',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact Number is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact Number is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact Number is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
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
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
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
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local Guardian information is required'],
    },
    profileImg: {
      type: String,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
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
  },
);

// Virtual
// studentSchema.virtual('fullName').get(function () {
//   return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
// });

// Document middleware
// pre save middleware/hook: will work on create save
// studentSchema.pre('save', async function (next) {
//   // console.log(this, 'pre hook: we will save data');
//   // Hashing password and save into DB
//   const user = this;
//   user.password = await bcrypt.hash(
//     this.password,
//     Number(config.bcrypt_salt_rounds),
//   );
//   next();
// });

// post save middleware/hook: will work on create save
// studentSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

//Query Middleware
// Pre hook/middleware
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//Pre hook for single find
studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
// Aggregate middleware
studentSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//creating a Custom instance method
// studentSchema.methods.isStudentExists = async (id: string) => {
//   const existingStudent = await Student.findOne({ id });
//   return existingStudent;
// };

// creating a Custom static method
studentSchema.statics.isStudentExists = async (id: string) => {
  const existingStudent = await Student.findOne({ id });
  return existingStudent;
};
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
