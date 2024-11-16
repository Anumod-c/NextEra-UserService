import { IUser } from "../IUser";

// Request DTO for registering a user
export interface RegisterUserRequestDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
}
// Response DTO for user registration
export interface RegisterUserResponseDTO {
  success: boolean;
  message: string;
  userData?: IUser;
}
// Request DTO for user login
export interface UserLoginRequestDTO {
  email: string;
  password: string;
}
// Response DTO for user login
export interface UserLoginResponseDTO {
  success: boolean;
  message: string;
  userData?: IUser;
}
// Request DTO for password reset
export interface ResetUserPasswordRequestDTO {
  email: string;
  password: string;
}
// Response DTO for password reset
export interface ResetPasswordResponseDTO {
  success: boolean;
  message: string;
  updatedUser?: IUser;
}

// Request DTO for adding a course to a user
export interface AddCourseToUserRequestDTO {
  userId: string;
  courseId: string;
}
// Response DTO for adding course to user
export interface AddCourseToUserResponseDTO {
  success: boolean;
  message: string;
  updatedUser?: IUser;
}
// Request DTO for editing user profile
export interface EditProfileRequestDTO {
  userId: string;
  data: Partial<IUser>;
}
// Response DTO for editing profile
export interface EditProfileResponseDTO {
  success: boolean;
  message: string;
}
export interface GoogleLoginDataRequestDTO {
  credential: string;
}
// Request DTO for updating profile picture
export interface UpdateProfilePictureRequestDTO {
  userId: string;
  profilePicture: string;
}
// Response DTO for updating profile picture
export interface UpdateProfilePictureResponseDTO {
  success: boolean;
  message: string;
}
export interface GetUserDetailsResponseDTO {
  success: boolean;
  message: string;
  user?: IUser | null;
}