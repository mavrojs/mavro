import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Request, Response, Middleware } from '../types';
import { Router } from '../router';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class App {
  private router: Router;
  private middleware: Middleware[] = [];

  /**
   * Initializes the App with a Router instance.
   * @param router - The Router instance to be used by the App.
   */
  constructor(router: Router) {
    this.router = router;
  }

  /**
   * Registers a middleware function to be applied to incoming requests.
   * @param middleware - The middleware function to be added to the middleware stack.
   */
  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Registers a GET route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  get(path: string, handler: Middleware) {
    this.router.register('GET', path, this.wrapHandler(handler));
  }

  /**
   * Registers a POST route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  post(path: string, handler: Middleware) {
    this.router.register('POST', path, this.wrapHandler(handler));
  }

  /**
   * Registers a PUT route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  put(path: string, handler: Middleware) {
    this.router.register('PUT', path, this.wrapHandler(handler));
  }

  /**
   * Registers a DELETE route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  delete(path: string, handler: Middleware) {
    this.router.register('DELETE', path, this.wrapHandler(handler));
  }

  /**
   * Registers a PATCH route with a specified path and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  patch(path: string, handler: Middleware) {
    this.router.register('PATCH', path, this.wrapHandler(handler));
  }

  /**
   * Registers a route with a specified method, path, and handler.
   * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
   */
  route(method: HttpMethod, path: string, handler: Middleware) {
    this.router.register(method, path, this.wrapHandler(handler));
  }

  /**
   * Registers a route with a specified method, path, and handler.
   * @param path - The path for the route.
   * @param handler - The middleware function to handle the route.
  */
  prefix(path:string, handler:Middleware){
    this.router
  }

  /**
   * Wraps a route handler to include application-level middleware.
   * @param handler - The route handler to wrap.
   * @returns A function that applies middleware before invoking the route handler.
   */
  private wrapHandler(handler: Middleware): Middleware {
    return (req: Request, res: Response, next: () => void) => {
      const chain = [...this.middleware, handler];
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
      const url = req.url || '/'; // Default to '/' if URL is undefined

      // Extend res to include a json method
      const extendedRes = res as Response;
      extendedRes.json = function (data: any) {
        this.writeHead(200, { 'Content-Type': 'application/json' });
        this.end(JSON.stringify(data));
      };

      try {
        this.router.handleRequest(method, url, req, extendedRes);
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
