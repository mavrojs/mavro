import { Request, Response } from "../types";

abstract class Controller {
  abstract routes(): {
    method: string;
    path: string;
    handler: (req: Request, res: Response, next: () => void) => void;
  }[];

  middleware?(): Array<(req: Request, res: Response, next: () => void) => void>;

  registerRoutes(router: any) {
    const routes = this.routes();
    const middlewares = this.middleware ? this.middleware() : [];
    routes.forEach((route) => {
      const { method, path, handler } = route;
      router[method.toLowerCase()](path, ...middlewares, handler);
    });
  }
}

export { Controller }