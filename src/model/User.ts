import mongoose, { Document, Schema, Types } from "mongoose";

import { IUser } from "../domain/entities/IUser";

export interface IUserDocument extends IUser, Document {}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String, // Added bio field
  },
  age: {
    type: Number, // Added age field
  },
  profilePicture: {
    type: String,
  },
  instagram: {
    type: String, // Added Instagram field
  },
  twitter: {
    type: String, // Added Twitter field
  },
  facebook: {
    type: String, // Added Facebook field
  },
  linkedin: {
    type: String, // Added LinkedIn field
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
  purchasedCourses: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

export const User = mongoose.model<IUserDocument>("User", userSchema);
