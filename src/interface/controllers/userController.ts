import { UserService } from "../../application/use-case/user";
import { AddCourseToUserRequestDTO, GoogleLoginDataRequestDTO, RegisterUserRequestDTO, ResetUserPasswordRequestDTO, UpdateProfilePictureRequestDTO, UserLoginRequestDTO } from "../../domain/entities/DTO/IUserController.dto";
import { IUser } from "../../domain/entities/IUser";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async registerUser(data: RegisterUserRequestDTO) {
    try {
      console.log(data, "register user");
      const result = await this.userService.registerUser(data);
      console.log("result of register", result);
      return result;
    } catch (error) {
      console.log("error in register user usercontroller", error);
    }
  }

  
  async registerOtp(data: {otp:string,userId:string}) {
    try {
      console.log("got inside the register otp", data);
      const result = await this.userService.verifyOtp(data);
      return result;
    } catch (error) {
      console.log("reigister otp error in usercontroller-userservice", error);
    }
  }


  async userLogin(data: UserLoginRequestDTO) {
    try {
      console.log("got inside userlogin  in userController");
      const result = await this.userService.userLogin(data);
      return result;
    } catch (error) {
      console.error("Error in Login user controller", error);
    }
  }


  async userForgotPass(email: string) {
    try {
      const result = await this.userService.userForgotPass(email);
      console.log("result got from userforgot pass in usercontroller", result);
      return result;
    } catch (error) {
      console.log("Error in userforgotPass", error);
    }
  }


  async forgotPassOtp(data: {otp:string}) {
    try {
      console.log("Handling forgot password OTP", data);
      const { otp } = data;
      const result = await this.userService.verifyForgotPassOtp(otp);
      return result;
    } catch (error) {
      console.error("Error handling forgot password OTP", error);
      return {
        success: false,
        message: "Error verifying OTP for forgot password",
      };
    }
  }


  async resetPassword(data: ResetUserPasswordRequestDTO) {
    console.log("Handling reset password ", data);
    const { email, password } = data;
    const result = await this.userService.resetPassword(email, password);
    return result;
  }


  async googleLogin(data: GoogleLoginDataRequestDTO) {
    console.log("google login reached in controller", data);
    const result = await this.userService.googleLogin(data);
    return result;
  }


  async forgotresendOtp(data: {email:string}) {
    try {
      console.log("resend otp in controller reached", data);
      const { email } = data;
      const result = await this.userService.forgotresendOtp(email);
      return result;
    } catch (error) {
      console.log("Errorin resendOtp method in usercontroller", error);
    }
  }


  async addCourseToUser(data: AddCourseToUserRequestDTO) {
    try {
      console.log("Adding course to user:", data,);
      const result = await this.userService.addCourseToUser(data);
      console.log("Course added to user successfully:", result);
      return result;
    } catch (error) {
      console.log("Error in adding course to user:", error);
      throw new Error("Failed to add course to user");
    }
  }


  async getUserDetails(userId: string) {
    try {
      const result = await this.userService.getUserDetails(userId);
      return result;
    } catch (error) {
      console.log("Error in adding course to user:", error);
      throw new Error("Failed to add course to user");
    }
  }


  async editProfile(data: Partial<IUser> & { id: string }) {
    try {
      console.log("edit data reached  editprofiele", data);
      const result = await this.userService.editProfile(data);
      return result;
    } catch (error) {
      console.log("Error in editin user details in controller");
    }
  }


  async updateProfilePicture(data: UpdateProfilePictureRequestDTO) {
    try {
      const result = await this.userService.updateProfilePicture(data);
      return result;
    } catch (error) {
      console.log("Error in updating  profilpicture");
    }
  }


  async checkUserBlocked(userId: string) {
    try {
      const result = await this.userService.checkUserBlocked(userId);
      return result;
    } catch (error) {
      console.log("Error in checking user blockedmiddleware", error);
    }
  }
}

export const userController = new UserController();
