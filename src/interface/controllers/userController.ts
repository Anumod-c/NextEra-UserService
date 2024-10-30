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
    async addCourseToUser(data:any){
        try {
            const { userId, courseId } = data;
            console.log('Adding course to user:',data, { userId, courseId });
    
            const result = await this.userService.addCourseToUser(userId, courseId);
            console.log('Course added to user successfully:', result);
            return result;
        } catch (error) {
            console.log('Error in adding course to user:', error);
            throw new Error('Failed to add course to user');
        }
    }
    async getUserDetails(userId:string){
        try {
            const result = await this.userService.getUserDetails(userId);
            return result;
        } catch (error) {
            console.log('Error in adding course to user:', error);
            throw new Error('Failed to add course to user');
        }
    }
    async editProfile(data:any){
        try {
            console.log("edit data reached  editprofiele",data);
            const result = await this.userService.editProfile(data);
            return result;
        } catch (error) {
            console.log("Error in editin user details in controller")
        }
    }
    async updateProfilePicture(data:any){
        try {
            const result = await this.userService.updateProfilePicture(data);
            return result;
        } catch (error) {
            console.log("Error in updating  profilpicture")
        }
    }
    async checkUserBlocked(userId:string){
        try {
            const result = await this.userService.checkUserBlocked(userId);
            return result
        } catch (error) {
            console.log('Error in checking user blockedmiddleware',error)
        }
    }
    

}

export const userController = new UserController();
