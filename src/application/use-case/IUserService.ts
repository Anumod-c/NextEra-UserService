import { GetUserDetailsResponseDTO, GoogleLoginDataRequestDTO, RegisterUserRequestDTO, UpdateProfilePictureRequestDTO, UserLoginRequestDTO } from "../../domain/entities/DTO/IUserService.dto";
import { IUser } from "../../domain/entities/IUser";

  
  export interface IUserService {
    registerUser(userData: RegisterUserRequestDTO): Promise<{
      message: string;
      forgotPass: boolean;
      success: boolean;
      otp: string;
      userData: RegisterUserRequestDTO;
    } | {
      success: boolean;
      message: string;
    }>;
  
    verifyOtp(otpObject: { otp: string }): Promise<{
      success: boolean;
      message: string;
      user_data?: IUser;
    } | {
      success: boolean;
      message: string;
    }>;
  
    userLogin(data: UserLoginRequestDTO): Promise<{
      success: boolean;
      message: string;
      user?: IUser;
    } | undefined>;
  
    userForgotPass(email: string): Promise<{
      forgotPass: boolean;
      user?: { email: string; name: string };
      otp: string;
      success: boolean;
      message: string;
    } | {
      success: boolean;
      message: string;
    } | undefined>;
  
    verifyForgotPassOtp(otp: string): Promise<{
      success: boolean;
      message: string;
    }>;
  
    resetPassword(email: string, newPassword: string): Promise<{
      success: boolean;
      message: string;
    }>;
  
    googleLogin(data: GoogleLoginDataRequestDTO): Promise<{
      success: boolean;
      message: string;
      user?: IUser;
    }>;
  
    forgotresendOtp(email: string): Promise<{
      success: boolean;
      message: string;
      otp?: string;
    }>;
  
    addCourseToUser(userId: string, courseId: string): Promise<{
      success: boolean;
      message: string;
      data?: any;
    }>;
  
    getUserDetails(userId: string): Promise<GetUserDetailsResponseDTO>;
  
    editProfile(data: Partial<IUser> & { id: string }): Promise<{
      success: boolean;
      message: string;
      user?: IUser;
    }>;
  
    updateProfilePicture(data: UpdateProfilePictureRequestDTO): Promise<{
      success: boolean;
      message: string;
      pictureUrl?: string;
    }>;
  
    checkUserBlocked(userId: string): Promise<{
      success: boolean;
      message: string;
      user?: IUser | null;
    }>;
    getUserDetails(
        userId: string
      ): Promise<GetUserDetailsResponseDTO>;
  }
  