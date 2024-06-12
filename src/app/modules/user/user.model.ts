import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['student', 'faculty', 'admin'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);
// Document middleware
// pre save middleware/hook: will work on create save
userSchema.pre('save', async function (next) {
  // console.log(this, 'pre hook: we will save data');
  // Hashing password and save into DB
  const user = this;
  user.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// // // post save middleware/hook: will work on create save
// userSchema.post('save', function (doc, next) {
//   doc.password = '';
//   next();
// });

// Create static method for checking user exist
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  const existingUser = await User.findOne({ id }).select('+password');
  return existingUser;
};
//create static method for checking password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  const isPasswordMatched = await bcrypt.compare(
    plainTextPassword,
    hashedPassword,
  );

  return isPasswordMatched;
};
//create static method for checking issued time is before change password time
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimeStamp: Date,
  jwtIssuedTimeStamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimeStamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimeStamp;
};
// studentSchema.methods.isStudentExists = async (id: string) => {
//   const existingStudent = await Student.findOne({ id });
//   return existingStudent;
// };
export const User = model<TUser, UserModel>('User', userSchema);
