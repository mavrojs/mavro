import { createServer, IncomingMessage, ServerResponse } from "http";
import { Router } from "../router";
import { Middleware } from "../types";

/**
 * Represents a web application with routing capabilities.
 * Provides methods to define routes and start the server.
 */
class App {
  private router: Router;

  /**
   * Creates an instance of the App class.
   *
   * @param {Router} router - The router instance used for handling routes.
   */
  constructor(router: Router) {
    this.router = router;
  }

  /**
   * Registers a GET route with the given path and handler.
   *
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  get(path: string, handler: Middleware) {
    this.router.register("GET", path, handler);
  }

  /**
   * Registers a POST route with the given path and handler.
   *
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  post(path: string, handler: Middleware) {
    this.router.register("POST", path, handler);
  }

  /**
   * Registers a PUT route with the given path and handler.
   *
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  put(path: string, handler: Middleware) {
    this.router.register("PUT", path, handler);
  }

  /**
   * Registers a DELETE route with the given path and handler.
   *
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  delete(path: string, handler: Middleware) {
    this.router.register("DELETE", path, handler);
  }

  /**
   * Registers a PATCH route with the given path and handler.
   *
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  patch(path: string, handler: Middleware) {
    this.router.register("PATCH", path, handler);
  }

  /**
   * Registers a route with the specified HTTP method, path, and handler.
   * This method allows for more complex routing scenarios.
   *
   * @param {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method - The HTTP method for the route.
   * @param {string} path - The path for the route.
   * @param {Middleware} handler - The middleware function to handle the request.
   */
  route(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    handler: Middleware
  ) {
    this.router.register(method, path, handler);
  }

  /**
   * Starts the server and begins listening for incoming requests.
   *
   * @param {number} port - The port number on which the server will listen.
   * @param {() => void} [callback] - Optional callback function to be called when the server starts listening.
   */
  listen(port: number, callback?: () => void) {
    const App = createServer((req: IncomingMessage, res: ServerResponse) => {
      const method = req.method as string;
      const url = req.url as string;

      this.router.handleRequest(method, url, req, res);
    });

    App.listen(port, callback);
  }
}

const router = new Router();
export const app = new App(router);
