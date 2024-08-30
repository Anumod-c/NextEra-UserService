import { UserService } from "../../application/use-case/user";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async registerUser(data: any) {
        try {
            console.log(data, "register user");
            const result = await this.userService.registerUser(data);
            console.log("result of register", result);
            return result;
        } catch (error) {
            console.log("error in register user usercontroller", error);
        }
    }

    async registerOtp(data: any) {
        try {
            console.log("got inside the register otp", data);
            const result = await this.userService.verifyOtp(data);
            return result;
        } catch (error) {
            console.log("reigister otp error in usercontroller-userservice", error);
        }
    }

    async userLogin(data: any) {
        try {
            const { email, password } = data;
            console.log("got inside userlogin  in userController");
            const result = await this.userService.userLogin(email, password);
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
    async forgotPassOtp(data: any) {
        try {
            console.log("Handling forgot password OTP", data);
            const { otp } = data;
            // Implement logic to verify OTP for forgot password
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
    async resetPassword(data: any) {
        console.log("Handling reset password ", data);
        const { email, password } = data;
        const result = await this.userService.resetPassword(email, password);
        return result
    }
    async googleLogin(data:any){
        console.log('google login reached in controller',data);
        const {credential} =  data;
        const result = await this.userService.googleLogin(credential);
        return result
            
    }
    async forgotresendOtp(data:any){
        try{

            console.log('resend otp in controller reached',data);
            const {email}= data;
            const result =  await this.userService.forgotresendOtp(email);
            return result;
        }catch(error){
            console.log("Errorin resendOtp method in usercontroller",error)
        }
    }
}

export const userController = new UserController();
