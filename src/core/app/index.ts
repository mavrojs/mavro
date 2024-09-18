import { createServer, IncomingMessage, ServerResponse } from "http";
import { Request, Response, Middleware } from "../types";
import { Router } from "../router";
import { Console } from "../utils";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

class App {
  private router: Router;
  private middleware: Middleware[] = [];
  
  /**
   * Initializes the App with a Router instance.
   * @param router - The Router instance to be used by the App.
   */
  constructor(router: Router) {
    this.router = router;
    // Register global logger middleware
    this.use(this.logger);
  }

  /**
   * Logger middleware that logs incoming requests and the status code after the response is sent.
   */
  private logger: Middleware = (req: Request, res: Response, next: () => void) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      Console.status(res.statusCode, `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });

    next();
  };

  /**
   * Registers a middleware function to be applied to incoming requests.
   * @param middleware - The middleware function to be added to the middleware stack.
   */
  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  get(path: string, ...middlewares: Middleware[]) {
    this.router.register('GET', path, this.wrapHandler(middlewares.pop()!, middlewares));
  }
  
  post(path: string, ...middlewares: Middleware[]) {
    this.router.register('POST', path, this.wrapHandler(middlewares.pop()!, middlewares));
  }
  
  put(path: string, ...middlewares: Middleware[]) {
    this.router.register('PUT', path, this.wrapHandler(middlewares.pop()!, middlewares));
  }
  
  delete(path: string, ...middlewares: Middleware[]) {
    this.router.register('DELETE', path, this.wrapHandler(middlewares.pop()!, middlewares));
  }
  
  patch(path: string, ...middlewares: Middleware[]) {
    this.router.register('PATCH', path, this.wrapHandler(middlewares.pop()!, middlewares));
  }

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  route(method: HttpMethod, path: string, ...middlewares: Middleware[]) {
    this.router.register(method, path, this.wrapHandler(middlewares.pop()!, middlewares));
  }

  /**
   * Wraps a route handler to include application-level middleware and logger.
   * @param handler - The route handler to wrap.
   * @returns A function that applies middleware before invoking the route handler.
   */
  private wrapHandler(handler: Middleware, routeMiddleware: Middleware[]): Middleware {
    return (req: Request, res: Response, next: () => void) => {
      // Combine global and route-specific middleware
      const chain = [...this.middleware, ...routeMiddleware, handler];
      let index = 0;
  
      const applyMiddleware = async () => {
        if (index < chain.length) {
          const currentMiddleware = chain[index++];
          try {
            await new Promise<void>((resolve, reject) => {
              currentMiddleware(req, res, (err?: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
            await applyMiddleware();  // Continue to the next middleware/handler
          } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();  // All middleware processed, move to the next in line
        }
      };
  
      applyMiddleware();  // Start middleware chain
    };
  }
  
  /**
   * Starts the server and listens for incoming requests on the specified port.
   * @param port - The port to listen on.
   * @param callback - Optional callback function to run when the server starts.
   */
  listen(port: number, callback?: () => void) {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const method = req.method as HttpMethod;
      const url = req.url || "/"; // Default to '/' if URL is undefined

      // Extend res to include a json method
      const extendedRes = res as Response;
      extendedRes.json = function (data: any) {
        this.writeHead(200, { "Content-Type": "application/json" });
        this.end(JSON.stringify(data));
      };

      try {
        this.router.handleRequest(method, url, req, extendedRes);
      } catch (err) {
        // Handles any errors that occur during request processing
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });

    server.listen(port, callback);
  }
}

const router = new Router();
export const app = new App(router);
