import { AdminRepository } from "../../domain/repositories/admin/adminRepository";

export class AdminService{
    private adminRepo:AdminRepository;
    
    constructor(){
        this.adminRepo= new AdminRepository();
    }

    async userList(){
        try{
            const result = await this.adminRepo.userList();
            return result
        }catch(error){
            console.log('error in userlist in admin.ts')
        }
    }
    async getStudentCount(){
        try{
            const result = await this.adminRepo.getStudentCount();
            return result
        }catch(error){
            console.log('error in userlist in admin.ts')
        }
    }

    async changeStatus (data:{userId:string;status:boolean;}){
        try{
            const result = await this.adminRepo.changeStatus(data)
            return result
        }catch(error){
            console.log('error in change status in admin.ts',error);           
        }
    }
}