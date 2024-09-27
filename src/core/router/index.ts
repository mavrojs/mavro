import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { Route, HttpMethod, Middleware } from "../types";

export class Router {
  private routes: Route[] = [];

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  register(method: HttpMethod, path: string, ...handlers: Middleware[]) {
    this.routes.push({ method, path, handler: this.chainMiddleware(handlers) });
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
      // Call the route's handler with params and handle middleware chaining
      const params = this.extractParams(route.path, pathname as string);
      (req as any).params = params; // Attach params to req object
      route.handler(req as any, res as any, () => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not Found" }));
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
   * Executes the handler function and middleware chain.
   * @param handler - The middleware or handler to execute.
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   */
  private chainMiddleware(handlers: Middleware[]): Middleware {
    return (req, res, next) => {
      let index = 0;

      const executeHandler = () => {
        const handler = handlers[index++];
        if (handler) {
          handler(req, res, (err?: any) => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
            } else {
              executeHandler();
            }
          });
        } else {
          next();
        }
      };

      executeHandler();
    };
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

const router = new Router();
export { router };
