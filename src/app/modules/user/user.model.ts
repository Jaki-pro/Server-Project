import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: true },
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

// // post save middleware/hook: will work on create save
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
export const User = model<TUser>('User', userSchema);
