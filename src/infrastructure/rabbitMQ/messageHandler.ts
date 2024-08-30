import { userController } from '../../interface/controllers/userController';
import RabbitMQClient from './clients';

export default class MessageHandlers{
    static async handle(operations:string,data :any, correlationId:string,replyTo:string){
        let response;
        switch(operations){
            case 'register_user':
                console.log('Handling operation',operations,data);
                response = await userController.registerUser(data);
                console.log("data reached inside message handler.ts",response);
                break;
            case 'register_otp':
                console.log('Handling OPeration',operations,data);
                response = await userController.registerOtp(data);
                console.log('data(OTP) reached insidet the message handler',response)
                break;
            case 'user_login':
                console.log('loign in handler reached');
                response = await userController.userLogin(data);
                console.log('response came from userLogin  in message handler')
                break;
            case 'user_forgot_pass':
                console.log('login in handler reached for forgotpass');
                response =  await userController.userForgotPass(data);
                console.log("message came from mesage handler for forgototp",response)
                break;
            case 'forgot_pass_otp': // Add this case for forgot password OTP
                console.log('Handling Operation for forgot_pass_otp', operations, data);
                response = await userController.forgotPassOtp(data);
                console.log('data(OTP) for forgot password reached inside the message handler', response);
                break;
            case 'user_reset_pass':
                console.log('Handling Operation for user_reset_pass', operations, data);
                response = await userController.resetPassword(data);
                console.log('data(RESETPASSWORD) for reset password reached inside the message handler', response);
                break;
            case 'google_login':
                console.log("Handling Operation for google_login",operations,data);
                response = await userController.googleLogin(data)
                break;
            case 'forgot_pass_resend_otp':
                console.log('data reached indside the forgot pass resent otp',operations,data);
                response = await userController.forgotresendOtp(data);
                console.log('response got from forgot pass resend otp',response);
                break;
           

        }
        await RabbitMQClient.produce(response,correlationId,replyTo)

    }
}