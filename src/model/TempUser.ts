import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../domain/entities/IUser";

export interface ITemporaryUser extends Document {
  otp: string;
  userData?: IUser;
  createdAt: Date;
}

const TemporaryUserSchema: Schema = new Schema({
  otp: { type: String, required: true },
  userData: { type: Object as any, required: false }, 
  createdAt: { type: Date, default: Date.now, expires: 900 }, 
});

export const TemporaryUser = mongoose.model<ITemporaryUser>(
  "TemporaryUser",
  TemporaryUserSchema
);
