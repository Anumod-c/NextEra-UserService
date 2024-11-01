import { User } from "../../../model/User";
import { IUser } from "../../entities/IUser";


export class AdminRepository{
    async userList(){
        try{
            console.log('userlist in adminrepository');
            const userData = await User.find({}).sort({_id:-1});
            console.log('succesully fetched userdata',userData);
            
            return userData
        }catch(error){
            const err = error as Error;
            console.log("Error user listing admin :", err);
            throw new Error(`Error user listing admin :${err.message}`);
            
        }
    }

    async getStudentCount(){
        try{
            const userCount = await User.countDocuments()
            console.log('usercount',userCount);

            return userCount
        }catch(error){
            const err = error as Error;
            console.log("Error user get count admin :", err);
            throw new Error(`rror user get count admin :${err.message}`);   
        }
    }

    async changeStatus(data:{userId:string,status:boolean}){
        try{
            const updatedUser = await User.findByIdAndUpdate(data.userId,{status:data.status},{new:true});

            if(!updatedUser){
                throw new Error("User not found to change status")
            }
            return{
                success:true,
                message:`User ${data.status ? 'unblocked' : 'blocked'} successfully`,
                user: updatedUser,
            }
        }catch(error){
              console.error('Error in Admin Repo (changeStatus):', error);
            throw new Error('Error in changing user status');
            
        }
    }

}

