import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from '../types';

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: Middleware;
}

export class Router {
  private routes: Route[] = [];

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  register(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', path: string, handler: Middleware) {
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
    const route = this.routes.find(route => route.method === method && route.path === path);

    if (route) {
      // Adapting the handler to use IncomingMessage and ServerResponse
      try {
        route.handler(req as any, res as any, () => {});
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }
}

const router = new Router();
export { router };
