import { ObjectId } from "mongoose";

export interface IUser{
    // _id?: ObjectId;
    name : string;
    email: string;
    phone :string;
    password : string;
    profilePicture? : string;
    status:boolean
    created_At? :Date;
}


export  interface ITemporaryUser {
    otp:string;
    userData:IUser;
    created_At? :Date;
}

