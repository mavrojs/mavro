import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { Debug } from "../utils";
import { Route, HttpMethod, Middleware } from "../types";

export class Router {
  private routes: Route[] = [];
  private middleware: Middleware[] = [];

  constructor() {
    // Register the logger middleware globally
    this.use(this.logger);
  }

  /**
   * Registers a middleware function to be applied to all incoming requests.
   * @param middleware - The middleware function to be added to the middleware stack.
   */
  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Logger middleware to log request details and response status code.
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   * @param next - The function to pass control to the next middleware.
   */
  private logger: Middleware = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      Debug.status(
        res.statusCode,
        `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
      );
    });

    next();
  };

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handlers - The middleware functions to handle the route.
   */
  register(method: HttpMethod, path: string, ...handlers: Middleware[]) {
    const chainedHandlers = this.chainMiddleware(handlers);
    this.routes.push({ method, path, handler: chainedHandlers });

    // Log the registration of the route
    Debug.info(`Registered route: [${method}] ${path}`);
  }

  /**
   * Handles an incoming request by matching it to a registered route.
   * @param method - The HTTP method of the request.
   * @param path - The path of the request.
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   */
  handleRequest(
    method: string,
    path: string,
    req: IncomingMessage,
    res: ServerResponse
  ) {
    const { pathname, query } = parse(req.url as string, true);
    (req as any).query = query; // Attach query params to req object

    const route = this.findRoute(method, pathname as string);

    if (route) {
      const params = this.extractParams(route.path, pathname as string);
      (req as any).params = params; // Attach params to req object
      this.executeMiddleware([...this.middleware, route.handler], req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
      Debug.error(`${method} ${path} 404`);
    }
  }

  /**
   * Finds a matching route based on method and path.
   * @param method - The HTTP method.
   * @param path - The path to match.
   * @returns The matched route or undefined if not found.
   */
  private findRoute(method: string, path: string): Route | undefined {
    return this.routes.find((route) => {
      const params = this.extractParams(route.path, path);
      return route.method === method && params !== null;
    });
  }

  /**
   * Chains multiple middleware functions and handlers.
   * @param handlers - An array of middleware functions and the final route handler.
   * @returns A single middleware function that processes the chain.
   */
  private chainMiddleware(handlers: Middleware[]): Middleware {
    return (req, res, next) => {
      let index = 0;
      const execute = (err?: any) => {
        if (err) return err;
        if (index >= handlers.length) return next();

        const handler = handlers[index++];
        handler(req, res, execute);
      };
      execute();
    };
  }

  /**
   * Executes a chain of middleware functions.
   * @param handlers - The middleware or handler to execute.
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   */
  private executeMiddleware(
    handlers: Middleware[],
    req: IncomingMessage,
    res: ServerResponse
  ) {
    let index = 0;

    const next = (err?: any) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        Debug.error(`Error: ${err.message}`);
        return;
      }

      if (index >= handlers.length) return;

      const handler = handlers[index++];
      handler(req as any, res as any, next);
    };

    next();
  }

  /**
   * Extracts parameters from the route path based on the request path.
   * @param routePath - The route's path (e.g., /user/:id).
   * @param requestPath - The actual request path.
   * @returns A dictionary of extracted parameters or null if no match.
   */
  private extractParams(
    routePath: string,
    requestPath: string
  ): { [key: string]: string } | null {
    const routeParts = routePath.split("/");
    const requestParts = requestPath.split("/");

    if (routeParts.length !== requestParts.length) return null;

    const params: { [key: string]: string } = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = requestParts[i];
      } else if (routeParts[i] !== requestParts[i]) {
        return null; // No match
      }
    }

    return params;
  }

  /**
   * Registers a GET method route with the provided path and middleware functions.
   * @param path - The path for the GET route.
   * @param middlewares - Middleware functions to be applied to the route.
   */
  get(path: string, ...middlewares: Middleware[]) {
    this.register("GET", path, ...middlewares);
    return this; // Return the router instance for chaining
  }

  /**
   * Registers a POST method route with the provided path and middleware functions.
   * @param path - The path for the POST route.
   * @param middlewares - Middleware functions to be applied to the route.
   */
  post(path: string, ...middlewares: Middleware[]) {
    this.register("POST", path, ...middlewares);
    return this;
  }

  /**
   * Registers a PUT method route with the provided path and middleware functions.
   * @param path - The path for the PUT route.
   * @param middlewares - Middleware functions to be applied to the route.
   */
  put(path: string, ...middlewares: Middleware[]) {
    this.register("PUT", path, ...middlewares);
    return this;
  }

  /**
   * Registers a DELETE method route with the provided path and middleware functions.
   * @param path - The path for the DELETE route.
   * @param middlewares - Middleware functions to be applied to the route.
   */
  delete(path: string, ...middlewares: Middleware[]) {
    this.register("DELETE", path, ...middlewares);
    return this;
  }

  /**
   * Registers a PATCH method route with the provided path and middleware functions.
   * @param path - The path for the PATCH route.
   * @param middlewares - Middleware functions to be applied to the route.
   */
  patch(path: string, ...middlewares: Middleware[]) {
    this.register("PATCH", path, ...middlewares);
    return this;
  }

  /**
   * Registers routes for multiple HTTP methods based on a resource handler object.
   * @param path - The base path for the resource.
   * @param middlewares - An array of middleware functions to be applied to all routes.
   * @param controller - A controller class with methods named after HTTP methods (get, post, put, delete, patch).
   */
  resource(
    path: string,
    middlewares: Middleware[],
    controller: {
      get?: Middleware;
      post?: Middleware;
      put?: Middleware;
      delete?: Middleware;
      patch?: Middleware;
    }
  ) {
    if (controller.get) {
      this.get(path, ...middlewares, controller.get);
    }
    if (controller.post) {
      this.post(path, ...middlewares, controller.post);
    }
    if (controller.put) {
      this.put(path, ...middlewares, controller.put);
    }
    if (controller.delete) {
      this.delete(path, ...middlewares, controller.delete);
    }
    if (controller.patch) {
      this.patch(path, ...middlewares, controller.patch);
    }
  }
}

// Create an instance of the Router
const router = new Router();
export { router };
