// /src/interfaces/dtos/IUserDTO.ts

import { IUser } from "../IUser";

// Request DTO for checking user credentials
export interface CheckUserRequestDTO {
  email: string;
  password: string;
}

// Response DTO for checking user credentials
export interface CheckUserResponseDTO {
  success: boolean;
  message: string;
  userData?: IUser;
}

// Response DTO for verifying forgot password OTP
export interface VerifyForgotPassOtpResponseDTO {
  success: boolean;
  message: string;
  forgotPass: boolean;
}

// Request DTO for resetting the user's password
export interface ResetUserPasswordRequestDTO {
  email: string;
  newPassword: string;
}

// Response DTO for resetting the user's password
export interface ResetUserPasswordResponseDTO {
  success: boolean;
  message: string;
  updatedUser?: IUser;
}

// Request DTO for adding a course to a user
export interface AddCourseToUserRequestDTO {
  userId: string;
  courseId: string;
}

// Response DTO for adding a course to a user
export interface AddCourseToUserResponseDTO {
  success: boolean;
  message: string;
  updatedUser?: IUser;
}

// Response DTO for getting user details
export interface GetUserDetailsResponseDTO {
  success: boolean;
  message: string;
  user?: IUser | null;
}

// Request DTO for editing profile
export interface EditProfileRequestDTO extends Partial<IUser> {
  id: string;
}

// Response DTO for editing profile
export interface EditProfileResponseDTO {
  success: boolean;
  message: string;
}

// Request DTO for updating profile picture
export interface UpdateProfilePictureRequestDTO {
  profilePicture: string;
  userId: string;
}

// Response DTO for updating profile picture
export interface UpdateProfilePictureResponseDTO {
  success: boolean;
  message: string;
}

// Response DTO for checking if a user is blocked
export interface CheckUserBlockedResponseDTO {
  success: boolean;
  message: string;
  user?: IUser | null;
}
