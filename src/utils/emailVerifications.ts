import nodemailer from 'nodemailer';

import config from '../infrastructure/config/config';


const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:config.EMAIL,
        pass:config.EMAIL_PASS
    }
});

export const sendOtpMail = async (to:string,name:string,otp:string):Promise<void>=>{
    const mailOptions = {
        from: config.EMAIL,
        to,
        subject: "Your OTP Code",
        text: `your otp is : ${otp}`,
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <div style="background-color: #f7f7f7; padding: 20px;">
                
            </div>
            <div style="padding: 20px;">
                <h1 style="color: #333;">Your OTP Code</h1>
                <p style="font-size: 16px; color: #555;">Dear ${name},</p>
                <p style="font-size: 16px; color: #555;">Your OTP code is <strong style="font-size: 24px;">${otp}</strong></p>
                <p style="font-size: 16px; color: #555;">Please use this code to complete your verification process.</p>
                <p style="font-size: 16px; color: #555;">Thank you,</p>
                <p style="font-size: 16px; color: #555;">NextEra</p>
            </div>
            <div style="background-color: #f7f7f7; padding: 20px;">
                <p style="font-size: 14px; color: #999;">&copy; 2024 Your Company. All rights reserved.</p>
                <p style="font-size: 14px; color: #999;"><a href="anumodc2001@gmail.com" style="color: #0073e6;">anumodc2001@gmail.com</a></p>
            </div>
        </div>`,
    } 
    try{

        await transporter.sendMail(mailOptions);
        console.log('Mail send to ',to); 
        
    }catch(err){
        console.log("Failed to send otp email",err);
        throw new Error("Failed to send OTP email");
    }
}