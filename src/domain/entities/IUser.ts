export interface IUser{
    // _id?:string
    name : string;
    email: string;
    phone :string;
    password : string;
    profilePicture? : string;
    created_At? :Date;
}


export  interface ITemporaryUser {
    otp:string;
    userData:IUser;
    created_At? :Date;
}

