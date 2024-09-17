import { Middleware, Request, Response } from "../types";

export class MiddlewareManager {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  async execute(req: Request, res: Response): Promise<void> {
    let index = -1;

    const run = async (i: number): Promise<void> => {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const middleware = this.middlewares[i];
      if (middleware) {
        await middleware(req, res, () => run(i + 1));
      }
    };

    await run(0);
  }
};

export const loggerMiddleware: Middleware = (req: Request, res: Response, next: () => void) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

export const errorHandlerMiddleware: Middleware = async (req: Request, res: Response, next: () => void) => {
  try {
    await next();
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const notFoundMiddleware: Middleware = (req: Request, res: Response, next: () => void) => {
  res.status(404).send("Not Found");
};