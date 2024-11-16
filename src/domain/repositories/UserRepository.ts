import { IUserRepository } from "./IUserRepository";
import { IUpdateProfilePicture, IUser } from "../entities/IUser";
import bcrypt from "bcryptjs";
import { User } from "../../model/User";
import { TemporaryUser } from "../../model/TempUser";
import {
  AddCourseToUserRequestDTO,
  AddCourseToUserResponseDTO,
  CheckUserBlockedResponseDTO,
  CheckUserRequestDTO,
  CheckUserResponseDTO,
  EditProfileRequestDTO,
  EditProfileResponseDTO,
  GetUserDetailsResponseDTO,
  ResetUserPasswordRequestDTO,
  ResetUserPasswordResponseDTO,
  UpdateProfilePictureRequestDTO,
  UpdateProfilePictureResponseDTO,
  VerifyForgotPassOtpResponseDTO,
} from "../entities/DTO/IUserRepository.dto";

export class UserRepository implements IUserRepository {
  async saveTempUser(otp: string, userData: any) {
    try {
      const temporaryUser = new TemporaryUser({
        otp: otp,
        userData: userData,
      });
      const result = await temporaryUser.save();
      console.log("this is the reult", result);
      return result;
    } catch (error) {
      console.log("error  in saving temporary user", error);
    }
  }


  async findTempUser(data: { userId: string; otp: string }) {
    const { otp, userId } = data;
    try {
      const temporaryUser = await TemporaryUser.findOne({
        _id: userId,
        otp: otp,
      });
      if (!temporaryUser) return { success: false, message: "Invalid OTP" };
      return {success: true,message: "OTP validation successful",temporaryUser};
    } catch (error) {
      console.error("Error finding temporary user:", error);
      throw new Error(`Error finding temporary user: ${(error as Error).message}`
      );
    }
  }


  async deleteTempUser(data: { userId: string; otp: string }) {
    const { otp, userId } = data;
    try {
    const result =await TemporaryUser.deleteOne({ _id: userId, otp: otp });
    if (result.deletedCount === 0) {
      console.log("No temporary user record found to delete.");
    } else {
      console.log("Temporary user record deleted successfully.");
    }
    }catch (error) {
      console.error("Error deleting temporary user:", error);
      throw new Error(`Error deleting temporary user: ${(error as Error).message}`);
    }
  }


  async findByEmail(email: string): Promise<IUser | null> {
    try {
      console.log("reachd userRepository findByEmail", email);
      const user = await User.findOne({ email: email }).exec();
      return user;
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error finding user by email: ${err.message}`);
    }
  }


  async save(user: IUser): Promise<IUser> {
    try {
      console.log("save user in userrepository reached");
      const hashedPassword = await bcrypt.hash(user.password, 10);
      console.log("hashed password", hashedPassword);
      const userData = { ...user, password: hashedPassword };
      console.log("final user data", userData);
      const newUser = new User(userData);
      await newUser.save();
      console.log("new user saved!");
      return newUser;
    } catch (error) {
      const err = error as Error;
      console.error("Error saving user ", err);
      throw new Error(`Error saving user:${err.message}`);
    }
  }


  async checkUser(data: CheckUserRequestDTO): Promise<CheckUserResponseDTO> {
    const { email, password } = data;
    const userData = await User.findOne({ email });
    if (!userData) {
      return { success: false, message: "Invalid Email" };
    }
    const isPasswordMatch = await bcrypt.compare(password, userData.password);
    if (!isPasswordMatch) {
      console.log(" passord is incorrrect");
      return { success: false, message: "Invalid Password" };
    }
    return { success: true, message: "Login successfull", userData };
  }


  async verifyForgotPassOtp(otp: string): Promise<VerifyForgotPassOtpResponseDTO> {
    try {
      const otpEntry = await TemporaryUser.findOne({ otp }).exec();
      console.log("llllllllllllllllllll", otpEntry);
      if (!otpEntry) {
        return {
          success: false,
          message: "Invalid OTP. Please check and try again.",
          forgotPass: true,
        };
      }
      console.log("OTP verified successfully");
      return {
        success: true,
        message: "OTP verified successfully",
        forgotPass: true,
      };
    } catch (error) {
      const err = error as Error;
      console.error("Error verifying forgot password OTP", err);
      return {
        success: false,
        forgotPass: true,
        message: `Error verifying OTP: ${err.message}`,
      };
    }
  }


  async resetUserPassword(
    data: ResetUserPasswordRequestDTO
  ): Promise<ResetUserPasswordResponseDTO> {
    const { email, newPassword } = data;
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return {
        success: true,
        message: "Password reset successfully",
        updatedUser: user,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error resetting user password: ${err.message}`);
    }
  }


  async addCourseToUser(
    data: AddCourseToUserRequestDTO
  ): Promise<AddCourseToUserResponseDTO> {
    const { userId, courseId } = data;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { purchasedCourses: courseId } },
        { new: true }
      ).exec();

      return {
        success: true,
        message: "CourseID added",
        updatedUser: updatedUser as IUser,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error adding course to user: ${err.message}`);
    }
  }


  async getUserDetails(userId: string): Promise<GetUserDetailsResponseDTO> {
    try {
      const user = await User.findOne({ _id: userId });
      console.log("userrrrrr", user);
      if (user) {
        return { message: "User found", success: true, user };
      } else {
        return { message: "User found", success: false, user };
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error fetching user details: ${err.message}`);
    }
  }


  async editProfile(
    data: EditProfileRequestDTO
  ): Promise<EditProfileResponseDTO> {
    try {
      console.log("Data in userrepository", data);
      const { id, ...updateFields } = data;
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: updateFields },
        { new: true }
      );
      console.log(user, "usersaved");
      if (!user) {
        return { success: false, message: "Couldnt save the user datas" };
      }
      return { success: true, message: "Succesfully saved user data" };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error editing user details: ${err.message}`);
    }
  }


  async updateProfilePicture(
    data: UpdateProfilePictureRequestDTO
  ): Promise<UpdateProfilePictureResponseDTO> {
    try {
      console.log("profile data reached userrepo", data);
      const { profilePicture, userId } = data;
      const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: { profilePicture: profilePicture } }
      );
      if (!user) {
        return { success: false, message: "Couldnt update profile picture" };
      } else {
        return {
          success: true,
          message: "Successfully updated profile picture",
        };
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(`Error updating the profile picture:${err.message}`);
    }
  }

  
  async checkUserBlocked(userId: string): Promise<CheckUserBlockedResponseDTO> {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false, message: "No user with this userId" };
      }
      return { success: true, message: "User found", user };
    } catch (error) {
      console.log("Error in fetching user with user id", error);
      return { success: false, message: "Internal server error" };
    }
  }
}
