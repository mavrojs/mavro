"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const controller_1 = require("../core/controller");
class UserController extends controller_1.Controller {
    static async get(req, res) {
        try {
            this.json(res, { message: "User data" }, 200);
        }
        catch (error) {
            // Corrected: handling errors
            this.error(res, "Failed to fetch user data");
        }
    }
}
exports.UserController = UserController;
