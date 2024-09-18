import { Request, Response } from "../core/types";
import { Controller } from "../core/controller";

export class UserController extends Controller {
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      this.json(res, { message: "User data" });
    } catch (error) {
      this.error(res, "Failed to fetch user data");
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Your logic here
      this.json(res, { message: "User created" });
    } catch (error) {
      this.error(res, "Failed to create user");
    }
  }
}