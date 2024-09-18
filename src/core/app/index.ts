import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Router } from '../router';
import { Middleware } from '../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class App {
  private router: Router;

  /**
   * Initializes the App with a Router instance.
   * @param router - The Router instance to be used by the App.
   */
  constructor(router: Router) {
    this.router = router;
  }

  /**
   * Registers a GET route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  get(path: string, handler: Middleware) {
    this.router.register('GET', path, handler);
  }

  /**
   * Registers a POST route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  post(path: string, handler: Middleware) {
    this.router.register('POST', path, handler);
  }

  /**
   * Registers a PUT route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  put(path: string, handler: Middleware) {
    this.router.register('PUT', path, handler);
  }

  /**
   * Registers a DELETE route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  delete(path: string, handler: Middleware) {
    this.router.register('DELETE', path, handler);
  }

  /**
   * Registers a PATCH route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  patch(path: string, handler: Middleware) {
    this.router.register('PATCH', path, handler);
  }

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  route(method: HttpMethod, path: string, handler: Middleware) {
    this.router.register(method, path, handler);
  }

  /**
   * Starts the server and listens for incoming requests on the specified port.
   * @param port - The port to listen on.
   * @param callback - Optional callback function to run when the server starts.
   */
  listen(port: number, callback?: () => void) {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const method = req.method as HttpMethod;
      const url = req.url || '/'; // Default to '/' if URL is undefined

      try {
        this.router.handleRequest(method, url, req, res);
      } catch (err) {
        // Handles any errors that occur during request processing
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });

    server.listen(port, callback);
  }
}

const router = new Router();
export const app = new App(router);
