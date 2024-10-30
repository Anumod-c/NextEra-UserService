import { ObjectId, Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    phone: string;
    password: string;
    bio:string;
    age:number;
    twitter:string;
    facebook:string;
    linkedin:string;
    instagram:string;
    profilePicture?: string;
    status: boolean;
    purchasedCourses: Types.ObjectId[];  // Array of ObjectIds for purchased courses
    wishlist: Types.ObjectId[];          // Array of ObjectIds for wishlist

    created_At?: Date;
}


export interface ITemporaryUser {
    otp: string;
    userData: IUser;
    created_At?: Date;
}

