import { compareSync, hashSync } from 'bcryptjs';
import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  encryptPassword: (password: string) => string;
  authenticate: (plainTextPassword: string) => boolean;
}

type UserDocument = Document & IUser;

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      hidden: true,
      required: true,
    },
  },
  {
    collection: 'User',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

UserSchema.methods = {
  authenticate(plainTextPassword: string) {
    return compareSync(plainTextPassword, this.password);
  },

  encryptPassword(password: string) {
    return hashSync(password);
  },
};

UserSchema.pre('save', function encryptPasswordHook(next) {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

const UserModel = model<UserDocument>('User', UserSchema);

export type { UserDocument };
export default UserModel;
