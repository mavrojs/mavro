"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const middleware_1 = require("../core/middleware");
const core_1 = require("../core");
class AuthMiddleware extends middleware_1.Middleware {
    handle(req, res, next) {
        core_1.Debug.warning("Pass from the middleware");
        next();
    }
}
exports.authMiddleware = new AuthMiddleware();
