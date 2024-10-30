import { IUserRepository } from "./IUserRepository";
import { IUser } from "../entities/IUser";
import bcrypt from 'bcryptjs';
import { User } from "../../model/User";
import { TemporaryUser } from "../../model/TempUser";

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        try {
            console.log('reachd userRepository findByEmail', email);

            const user = await User.findOne({ email: email }).exec()
            return user
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error finding user by email: ${err.message}`);
        }
    }

    async save(user: IUser): Promise<IUser> {
        try {
            console.log('save user in userrepository reached');
            const hashedPassword = await bcrypt.hash(user.password, 10);
            console.log('hashed password', hashedPassword);
            const userData = { ...user, password: hashedPassword };
            console.log('final user data', userData)
            const newUser = new User(userData);
            await newUser.save();
            console.log('new user saved!');
            return newUser
        } catch (error) {
            const err = error as Error;
            console.error("Error saving user ", err);
            throw new Error(`Error saving user:${err.message}`)
        }
    }
    async checkUser(email: string, password: string): Promise<{ success: boolean, message: string, userData?: IUser }> {
        const userData = await User.findOne({ email: email });
        if (!userData) {
            return { success: false, message: "Invalid Email" };
        }
        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            console.log(" passord is incorrrect")
            return { success: false, message: "Invalid Password" }
        } else {
            console.log("correct passsword for existing user", userData)
            return { success: true, message: "Login successfull", userData };
        }
    }
    async verifyForgotPassOtp(otp: string): Promise<{ success: boolean; message: string; forgotPass: boolean }> {
        try {
            // Assuming you have an OTP model for storing OTPs temporarily
            const otpEntry = await TemporaryUser.findOne({ otp }).exec();
            console.log('llllllllllllllllllll', otpEntry)
            if (!otpEntry) {
                return { success: false, message: 'Invalid OTP. Please check and try again.', forgotPass: true };
            }
            // Optionally, check if OTP has expired
            // const isExpired = otpEntry.expiresAt < new Date();
            // if (isExpired) {
            //     console.log('OTP has expired');
            //     return { success: false, message: 'OTP has expired' };
            // }
            console.log('OTP verified successfully');
            return { success: true, message: 'OTP verified successfully', forgotPass: true }
        } catch (error) {
            const err = error as Error;
            console.error('Error verifying forgot password OTP', err);
            return { success: false, forgotPass: true, message: `Error verifying OTP: ${err.message}` };
        }
    }
    async resetUserPassword(email: string, newPassword: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return null;
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return user
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error resetting user password: ${err.message}`);
        }
    }
    async addCourseToUser(userId: string, courseId: string): Promise<any> {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { purchasedCourses: courseId } }, // Use $addToSet to avoid duplicates
                { new: true } // Return the updated document
            ).exec();

            return { success: true, message: "CourseID added", updatedUser: updatedUser };
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error adding course to user: ${err.message}`);
        }
    }
    async getUserDetails(userId: string) {
        try {
            const user = await User.findOne({ _id: userId });
            console.log('userrrrrr', user)
            if (user) {
                return { message: "User found", success: true, user }
            } else {
                return { message: "User found", success: false, user }

            }
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error fetching user details: ${err.message}`);
        }
    }
    async editProfile(data: any) {
        try {
            console.log("Data in userrepository", data);
            const{id,...updateFields}=data;
            const user =await User.findOneAndUpdate(
                {_id:id},
                {$set:updateFields},
                {new:true}
            );
            console.log(user,'usersaved')
            if (!user) {
               
                return {success:false,message:"Couldnt save the user datas"}
            }
            return {success:true,message:"Succesfully saved user data"}

        } catch (error) {
            const err = error as Error;
            throw new Error(`Error editing user details: ${err.message}`);
        }
    }
    async updateProfilePicture(data:any){
        try {
            console.log('profile data reached userrepo',data)
            const{profilePicture,userId}= data;;
            const user =await User.findByIdAndUpdate({_id:userId},{$set:{profilePicture:profilePicture}});

            if(!user){
                return {success:false,message:"Couldnt update profile picture"}
            }else{
                return {success:true,message:"Successfully updated profile picture"}
            }
           
        } catch (error) {
            const err = error as Error;
            throw new Error(`Error updating the profile picture:${err.message}`);
        }
    }

    async checkUserBlocked(userId: string) {
        try {
            const user = await User.findOne({ _id: userId }); // Use await to resolve the promise
            if (!user) {
                return { success: false, message: 'No user with this userId' };
            }
            // Assume that the user has a 'status' field that indicates if the user is blocked
            return { success: true, message: "User found", user }; 
        } catch (error) {
            console.log("Error in fetching user with user id", error);
            return { success: false, message: 'Internal server error' }; // Handle errors gracefully
        }
    }
    

}