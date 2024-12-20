import { AdminService } from "../../application/use-case/admin";

class AdminController {
  private adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  async userList(data: { page: number; limit: number }) {
    try {
      const { page, limit } = data;
      const result = await this.adminService.userList(page, limit);
      return result;
    } catch (error) {
      console.log("errror in uselist in admincontroller");
    }
  }


  async getStudentCount() {
    try {
      const result = await this.adminService.getStudentCount();
      return result;
    } catch (error) {
      console.log("errror in uselist in admincontroller");
    }
  }

  
  async changeStatus(data: { userId: string; status: boolean }) {
    try {
      const result = await this.adminService.changeStatus(data);
      return result;
    } catch (error) {
      console.log("error in changing status", error);
    }
  }
}

export const adminController = new AdminController();
