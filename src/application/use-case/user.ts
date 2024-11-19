import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";
import config from "../../infrastructure/config/config";
import { TemporaryUser } from "../../model/TempUser";
import { OAuth2Client } from "google-auth-library";
import { sendOtpMail } from "../../utils/emailVerifications";
import {
  AddCourseToUserRequestDTO,
  GoogleLoginDataRequestDTO,
  RegisterUserRequestDTO,
  UpdateProfilePictureRequestDTO,
  UserLoginRequestDTO,
} from "../../domain/entities/DTO/IUserService.dto";
import { IUser } from "../../domain/entities/IUser";

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async registerUser(userData: RegisterUserRequestDTO) {
    try {
      console.log("reached user.ts in usecase");
      const existingUser = await this.userRepo.findByEmail(userData.email);
      console.log("user found", existingUser);
      if (existingUser) {
        return { success: false, message: "Email already registered" };
      } else {
        const otp = generateOtp();
        const forgotPass: boolean = false;
        console.log("generated OTP", otp);
        console.log(userData, "USER DATA");
        const tempData = await this.userRepo.saveTempUser(otp, userData);
        const {name,email}=userData
        await sendOtpMail(email,name, otp);
        return {
          message: "Verify the otp to complete registeration",
          forgotPass,
          success: true,
          otp,
          tempData,
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error saving user:${error.message}`);
      }
      throw error;
    }
  }


  async verifyOtp(data: { otp: string; userId: string }) {
    try {
      const { otp, userId } = data;
      console.log("Verifying OTP", otp, userId);
      const tempUserResponse = await this.userRepo.findTempUser({
        userId,
        otp,
      });
      if (!tempUserResponse.success || !tempUserResponse.temporaryUser) {
        return { success: false, message: "Invalid OTP" };
      }
      const temporaryUser = tempUserResponse.temporaryUser;
      console.log("Temporary User fetched successfully", temporaryUser);
      const userData = temporaryUser.userData;
      if (!userData) {
        return {
          success: false,
          message: "User data is missing in the temporary record",
        };
      }
      const savedUser = await this.userRepo.save(userData);
      await this.userRepo.deleteTempUser({ userId, otp });
      return {
        message: "User data saved successfully",
        success: true,
        user_data: savedUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error saving user:${error.message}`);
      }
    }
  }


  async userLogin(data: UserLoginRequestDTO) {
    try {
      const { email, password } = data;
      const result = await this.userRepo.checkUser({ email, password });
      return result;
    } catch (error) {
      console.log("Error in useLogin in userCase");
    }
  }


  async userForgotPass(email: string) {
    try {
      console.log(email, "EMAIL");
      const user = await this.userRepo.findByEmail(email);
      console.log("kkkkkkkkkkkkk", user);
      if (user) {
        const forgotPass: boolean = true;
        const otp = generateOtp();
        console.log(otp, "otp");
        const tempData = new TemporaryUser({
          otp: otp,
          email: email,
          createdAt: new Date(),
        });
        await tempData.save();
        await sendOtpMail(email,user.name, otp);
        return {
          forgotPass,
          user: { email: user.email, name: user.name },
          otp,
          success: true,
          message: "Found user with this email",
        };
      } else {
        return { success: false, message: "No user found with this email" };
      }
    } catch (error) {
      console.log("error in usecase for forgotpass", error);
    }
  }


  async verifyForgotPassOtp(otp: string) {
    try {
      console.log("Verifying forgot password OTP", { otp });
      const result = await this.userRepo.verifyForgotPassOtp(otp);
      return result;
    } catch (error) {
      console.error("Error verifying forgot password OTP:", error);
      return { success: false, message: "Error verifying OTP" };
    }
  }


  async resetPassword(email: string, newPassword: string) {
    try {
      const user = await this.userRepo.resetUserPassword({
        email,
        newPassword,
      });
      if (user) {
        return {
          success: true,
          message: "Password reset successfully",
        };
      } else {
        return { success: false, message: "User not found" };
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(`Password reset failed: ${err.message}`);
    }
  }


  async googleLogin(data: GoogleLoginDataRequestDTO) {
    try {
      const { credential } = data;
      console.log("hyyyy");
      const client = new OAuth2Client(config.googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        return { success: false, message: "Invalid Google token" };
      }
      const email = payload.email;
      if (!email) {
        return {
          success: false,
          message: "Google account does not have an email address",
        };
      }
      let user = await this.userRepo.findByEmail(email);
      if (user) {
        return { success: true, message: "Google login successful", user };
      } else {
        return { success: false, message: "Google login failed", user };
      }
    } catch (error) {
      const err = error as Error;
      throw new Error(`Google  login failed: ${err.message}`);
    }
  }


  async forgotresendOtp(email: string) {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const otp = generateOtp();
      console.log("resend otp generated", otp);
      const temporaryUser = await TemporaryUser.findOneAndUpdate(
        { "userData.email": email },
        { otp: otp, createdAt: new Date() },
        { new: true, upsert: true }
      );
      if (!temporaryUser) {
        return { success: false, message: "Temporary user data not found" };
      }
      await sendOtpMail(email,user.name,otp);
      return { success: true, message: "OTP resent succesfully", otp };
    } catch (error) {
      const err = error as Error;
      console.error("Error in resendOtp:", err.message);
      return { success: false, message: `Error resending OTP: ${err.message}` };
    }
  }


  async addCourseToUser(data: AddCourseToUserRequestDTO) {
    try {
      const result = await this.userRepo.addCourseToUser(data);
      return result;
    } catch (error) {
      console.log("Error in adding addCourseToUser", error);
    }
  }


  async getUserDetails(userId: string) {
    try {
      const result = await this.userRepo.getUserDetails(userId);
      return result;
    } catch (error) {
      console.log("Error in fetching user details", error);
    }
  }


  async editProfile(data: Partial<IUser> & { id: string }) {
    try {
      const result = await this.userRepo.editProfile(data);
      return result;
    } catch (error) {
      console.log("error in edit profile", error);
    }
  }


  async updateProfilePicture(data: UpdateProfilePictureRequestDTO) {
    try {
      const result = await this.userRepo.updateProfilePicture(data);
      return result;
    } catch (error) {
      console.log("Error in updatating profile picture in usercase", error);
    }
  }


  async checkUserBlocked(userId: string) {
    try {
      const result = await this.userRepo.checkUserBlocked(userId);
      return result;
    } catch (error) {
      console.log("Error in isblocked middleware", error);
    }
  }
}
