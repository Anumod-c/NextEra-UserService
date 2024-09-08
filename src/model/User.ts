import mongoose,{Document,Schema} from "mongoose";

import { IUser } from "../domain/entities/IUser";

export interface IUserDocument extends IUser,Document{}

const userSchema :Schema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    phone:{
        type: Number,
    },
    password:{
        type: String,
        required: true
    },
    created_at:{
        type:Date,
        required:true,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true,
    }
})


export const User = mongoose.model<IUserDocument>('User',userSchema);