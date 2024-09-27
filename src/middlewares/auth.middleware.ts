import { Request, Response, Next } from "../core/types";
import { Middleware } from "../core/middleware";
import { Debug } from "../core";

class AuthMiddleware extends Middleware {
  handle(req: Request, res: Response, next: Next): void {
    Debug.warning("Pass from the middleware");
    next();
  }
}

export const authMiddleware = new AuthMiddleware();