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
    purchasedCourses: Types.ObjectId[];  
    wishlist: Types.ObjectId[];          
    created_At?: Date;
}


export interface ITemporaryUser {
    otp: string;
    userData: IUser;
    created_At?: Date;
}

export interface IUpdateProfilePicture {
    userId: string;
    profilePicture: string;
}


