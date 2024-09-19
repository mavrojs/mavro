import { Request, Response, Next } from "../core/types";
import { Middleware } from "../core/middleware";

class AuthMiddleware extends Middleware {
  handle(req: Request, res: Response, next: Next): void {
    console.warn("Pass from the middleware");
    next();
  }
}

export const authMiddleware = new AuthMiddleware();