// /src/interfaces/IUserRepository.ts

import { IUser } from "../entities/IUser";
import {
  CheckUserRequestDTO,
  CheckUserResponseDTO,
  VerifyForgotPassOtpResponseDTO,
  ResetUserPasswordRequestDTO,
  ResetUserPasswordResponseDTO,
  AddCourseToUserRequestDTO,
  AddCourseToUserResponseDTO,
  GetUserDetailsResponseDTO,
  EditProfileRequestDTO,
  EditProfileResponseDTO,
  UpdateProfilePictureRequestDTO,
  UpdateProfilePictureResponseDTO,
  CheckUserBlockedResponseDTO,
} from '../entities/DTO/IUserRepository.dto'
export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;

  checkUser(
    data: CheckUserRequestDTO
  ): Promise<CheckUserResponseDTO>;

  verifyForgotPassOtp(
    otp: string
  ): Promise<VerifyForgotPassOtpResponseDTO>;

  resetUserPassword(
    data: ResetUserPasswordRequestDTO
  ): Promise<ResetUserPasswordResponseDTO>;

  addCourseToUser(
    data: AddCourseToUserRequestDTO
  ): Promise<AddCourseToUserResponseDTO>;

  getUserDetails(
    userId: string
  ): Promise<GetUserDetailsResponseDTO>;

  editProfile(
    data: EditProfileRequestDTO
  ): Promise<EditProfileResponseDTO>;

  updateProfilePicture(
    data: UpdateProfilePictureRequestDTO
  ): Promise<UpdateProfilePictureResponseDTO>;

  checkUserBlocked(
    userId: string
  ): Promise<CheckUserBlockedResponseDTO>;
}
