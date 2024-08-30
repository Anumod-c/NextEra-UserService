
import { IUser } from "../../domain/entities/IUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";
import config from "../../infrastructure/config/config";
import { TemporaryUser } from "../../model/TempUser";
import { OAuth2Client } from 'google-auth-library'
import { sendOtpMail } from "../../utils/emailVerifications";


export class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }



    async registerUser(userData: IUser): Promise<any> {
        try {
            console.log('reached user.ts in usecase');

            const existingUser = await this.userRepo.findByEmail(userData.email);
            console.log('user found', existingUser);
            if (existingUser) {
                return { success: false, message: "Email already registered" }
            } else {
                const otp = generateOtp();
                const forgotPass: boolean = false
                console.log('generated OTP', otp);
                console.log(userData, 'USER DATA');
                const temporaryUser = new TemporaryUser({
                    otp: otp,
                    userData: userData
                });
                await temporaryUser.save();
                await sendOtpMail(userData.email,otp)
                //send otp to mail



                return { message: "Verify the otp to complete registeration", forgotPass, success: true, otp, userData }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error saving user:${error.message}`)
            }
            throw error
        }
    }


    async verifyOtp(otpObject: { otp: string }): Promise<any> {
        try {
            const otp = otpObject.otp;
            console.log('Verifying OTP', otp);
            const temporaryUser = await TemporaryUser.findOne({ otp });
            if (!temporaryUser) {
                return { success: false, message: "Invalid OTP" };
            } console.log('temporaryUser', temporaryUser);

            const userData = temporaryUser.userData;
            if (!userData) {
                return { success: false, message: "User data is missing in the temporary record" };
            }
            const savedUser = await this.userRepo.save(userData);
            await TemporaryUser.deleteOne({ otp })
            return {
                message: "User data saved successfully",
                success: true,
                user_data: savedUser
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error saving user:${error.message}`)
            }
        }
    }
    async userLogin(email: string, password: string): Promise<any> {
        try {
            const result = await this.userRepo.checkUser(email, password);
            return result

        } catch (error) {
            console.log('Error in useLogin in userCase');

        }
    }
    async userForgotPass(email: string): Promise<any> {
        try {
            console.log(email, 'EMAIL');

            const user = await this.userRepo.findByEmail(email);
            console.log('kkkkkkkkkkkkk', user)
            if (user) {
                const forgotPass: boolean = true; //]]]]]]]]]]]]]]]]]]]]]]]]]
                const otp = generateOtp();
                console.log(otp, 'otp');

                const tempData = new TemporaryUser({
                    otp: otp,
                    email: email,
                    createdAt: new Date()
                })
                await tempData.save()
                // Ideally, send OTP to the user's email here
                await sendOtpMail(email,otp)

                return { forgotPass, user: { email: user.email, name: user.name }, otp, success: true, message: "Found user with this email" }
            } else {
                return { success: false, message: "No user found with this email" };
            }
        } catch (error) {
            console.log('error in usecase for forgotpass', error)
        }
    }
    async verifyForgotPassOtp(otp: string): Promise<any> {
        try {
            // Implement OTP verification logic for forgot password
            console.log('Verifying forgot password OTP', { otp });
            // Example logic
            const result = await this.userRepo.verifyForgotPassOtp(otp);
            return result;

            // For now, return a dummy success response
        } catch (error) {
            console.error('Error verifying forgot password OTP:', error);
            return { success: false, message: 'Error verifying OTP' };
        }
    }
    async resetPassword(email: string, password: string): Promise<any> {
        try {
            const user = await this.userRepo.resetUserPassword(email, password);
            if (user) {
                return {
                    success: true,
                    message: "Password reset successfully",
                    user: { email: user.email, name: user.name }, // Optional: Basic user info
                    // token: token // Optional: New authentication token
                };
            } else {
                return { success: false, message: "User not found" };
            }
        } catch (error) {
            const err = error as Error;
            throw new Error(`Password reset failed: ${err.message}`);
        }
    }
    async googleLogin(credential: string): Promise<any> {
        try {
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
             // Check if email is undefined
            if (!email) {
                return { success: false, message: "Google account does not have an email address" };
            }

            let user = await this.userRepo.findByEmail(email);
        if (user) {
            return { success: true, message: "Google login successful", user };
        } else {
            // Optionally, you could create a new user here
            return { success: false, message: "Google login failed", user };
        }
        } catch (error) {
            const err = error as Error;
            throw new Error(`Google  login failed: ${err.message}`);
        }
    }
    async forgotresendOtp(email:string):Promise<any>{
        try{
            const user =  await this.userRepo.findByEmail(email);
            if(!user){
                return {success:false,message:"User not found"};
            }
            const otp = generateOtp();
            console.log('resend otp generated',otp);
            const temporaryUser= await TemporaryUser.findOneAndUpdate(
                { 'userData.email': email },
                { otp: otp, createdAt: new Date() },
                { new: true, upsert: true });

                if(!temporaryUser){
                    return {success:false,message:"Temporary user data not found"};
                }
                await sendOtpMail(email,otp);
                return {success:true,message:"OTP resent succesfully",otp}

        }catch(error){
            const err = error as Error;
            console.error("Error in resendOtp:", err.message);
            return { success: false, message: `Error resending OTP: ${err.message}` };
        }
    }

}

