import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { Route, HttpMethod, Middleware } from '../types';

export class Router {
  private routes: Route[] = [];

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  register(method: HttpMethod, path: string, handler: Middleware) {
    this.routes.push({ method, path, handler });
  }

  /**
   * Handles an incoming request by matching it to a registered route.
   * @param method - The HTTP method of the request.
   * @param path - The path of the request.
   * @param req - The incoming HTTP request.
   * @param res - The outgoing HTTP response.
   */
  handleRequest(method: string, path: string, req: IncomingMessage, res: ServerResponse) {
    const { pathname, query } = parse(req.url as string, true);
    (req as any).query = query; // Attach query params to req object

    const route = this.findRoute(method, pathname as string);

    if (route) {
      // Call the route's handler with params and handle middleware chaining
      const params = this.extractParams(route.path, pathname as string);
      (req as any).params = params; // Attach params to req object
      this.executeHandler(route.handler, req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }

  /**
   * Finds a matching route based on method and path.
   * @param method - The HTTP method.
   * @param path - The path to match.
   * @returns The matched route or undefined if not found.
   */
  private findRoute(method: string, path: string): Route | undefined {
    return this.routes.find(route => {
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
  private executeHandler(handler: Middleware, req: IncomingMessage, res: ServerResponse) {
    try {
      handler(req as any, res as any, () => {});
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  /**
   * Extracts parameters from the route path based on the request path.
   * @param routePath - The route's path (e.g., /user/:id).
   * @param requestPath - The actual request path.
   * @returns A dictionary of extracted parameters or null if no match.
   */
  private extractParams(routePath: string, requestPath: string): { [key: string]: string } | null {
    const routeParts = routePath.split('/');
    const requestParts = requestPath.split('/');

    if (routeParts.length !== requestParts.length) return null;

    const params: { [key: string]: string } = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = requestParts[i];
      } else if (routeParts[i] !== requestParts[i]) {
        return null; // No match
      }
    }

    return params;
  }
}

const router = new Router();

export { router };
