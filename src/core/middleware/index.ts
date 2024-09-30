import { Request, Response, Next } from "../types";
import { Debug } from "../utils";

/**
 * A base middleware class providing methods to be extended by custom middleware classes.
 *
 * This class is intended to be extended by other middleware classes to define custom logic
 * for handling requests, responses, and proceeding to the next middleware in the chain.
 */
export class Middleware {
  /**
   * Handles the middleware process.
   *
   * @param req - The incoming request object.
   * @param res - The response object.
   * @param next - The callback function to proceed to the next middleware.
   *
   * This method should be overridden by extending middleware classes to define custom behavior.
   */
  static async handle(req: Request, res: Response, next: Next): Promise<void> {
    next();
  }

  /**
   * Sends an unauthorized response.
   *
   * @param res - The response object used to send the response.
   * @param message - The error message to send.
   *
   * This method can be used by extending classes to send a 401 Unauthorized response.
   */
  static unauthorized(res: Response, message: string): void {
    res.status(401).json({ error: message });
  }

  /**
   * Sends a forbidden response.
   *
   * @param res - The response object used to send the response.
   * @param message - The error message to send.
   *
   * This method can be used by extending classes to send a 403 Forbidden response.
   */
  static forbidden(res: Response, message: string): void {
    res.status(403).json({ error: message });
  }

  /**
   * Sends a success response.
   *
   * @param res - The response object.
   * @param data - Data to be sent back in the response.
   */
  static success(res: Response, data: any): void {
    res.status(200).json({ data });
  }
}

/**
 * MiddlewareManager class to manage and execute an array of middlewares.
 */
export class MiddlewareManager {
  private middlewares: ((
    req: Request,
    res: Response,
    next: () => void
  ) => void)[] = [];

  /**
   * Register a middleware.
   *
   * @param middleware - A middleware function to be added to the middleware chain.
   */
  use(
    middleware: (req: Request, res: Response, next: () => void) => void
  ): void {
    this.middlewares.push(middleware);
  }

  /**
   * Executes the registered middlewares in sequence.
   *
   * @param req - The request object.
   * @param res - The response object.
   */
  async execute(req: Request, res: Response): Promise<void> {
    let index = -1;

    const run = async (i: number): Promise<void> => {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const middleware = this.middlewares[i];
      if (middleware) {
        await new Promise((resolve:any) => middleware(req, res, resolve));
        await run(i + 1);
      }
    };

    await run(0);
  }
}

/**
 * Example logger middleware.
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: () => void
): void => {
  Debug.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

/**
 * Example error handler middleware.
 */
export const errorHandlerMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
): Promise<void> => {
  try {
    await next();
  } catch (error) {
    Debug.error(`${error}`);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Example 404 Not Found middleware.
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: () => void
): void => {
  res.status(404).send("Not Found");
};
