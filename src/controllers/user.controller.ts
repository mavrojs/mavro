import { Request, Response } from "../core/types";
import { Controller } from "../core/controller";

export class UserController extends Controller {
  static async get(req: Request, res: Response): Promise<void> {
    try {
      // Corrected: passing status code 200 for success
      this.json(res, { message: "User data" }, 200);
    } catch (error) {
      // Corrected: handling errors
      this.error(res, "Failed to fetch user data");
    }
  }
}