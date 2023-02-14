import { Schema, model, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CONSTANTS } from '../utils/constants';

export interface IUser {
  name: string;
  email: string;
  phone: string;
  pin: string;
  oldPin?: string;
  currentBalance: number;
  token: string;
}

export interface IUserDocument extends IUser, Document {
  encryptPin: (pin: string) => Promise<void>;
  comparePin: (pin: string) => Promise<boolean>;
  generateAuthToken: () => Promise<string>;
  verifyAuthToken: (token: string) => Promise<boolean>;
}

export type TUserModel = Model<IUserDocument>;

const userSchema = new Schema<IUser, TUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    pin: {
      type: String,
      default: '',
      trim: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.encryptPin = async function (pin: string) {
  const user = this as IUserDocument;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pin, salt);
  user.pin = hash;
  await user.save();
};

userSchema.methods.comparePin = async function (pin: string) {
  const user = this as IUserDocument;
  user.save();
  const isMatch = await bcrypt.compare(pin, user.pin);
  return isMatch;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this as IUserDocument;
  const token = jwt.sign({ _id: user._id }, CONSTANTS.JWT_KEY as string);
  user.token = token;
  await user.save();
};

userSchema.methods.verifyAuthToken = async function (token: string) {
  const user = this as IUserDocument;
  const decoded = jwt.verify(token, CONSTANTS.JWT_KEY as string);
  const { _id } = decoded as { _id: string };
  if (_id === user._id.toString()) {
    return true;
  }
  return false;
};

export const UserModel = model<IUserDocument, TUserModel>('User', userSchema);
