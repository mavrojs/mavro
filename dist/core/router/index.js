"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.Router = void 0;
const url_1 = require("url");
const utils_1 = require("../utils");
class Router {
    constructor() {
        this.routes = [];
        this.middleware = [];
        /**
         * Logger middleware to log request details and response status code.
         * @param req - The incoming HTTP request.
         * @param res - The outgoing HTTP response.
         * @param next - The function to pass control to the next middleware.
         */
        this.logger = (req, res, next) => {
            const startTime = Date.now();
            res.on("finish", () => {
                const duration = Date.now() - startTime;
                utils_1.Debug.status(res.statusCode, `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
            });
            next();
        };
        // Register the logger middleware globally
        this.use(this.logger);
    }
    /**
     * Registers a middleware function to be applied to all incoming requests.
     * @param middleware - The middleware function to be added to the middleware stack.
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    /**
     * Registers a route with a specified method, path, and handler.
     * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
     * @param path - The path for the route.
     * @param handlers - The middleware functions to handle the route.
     */
    register(method, path, ...handlers) {
        const chainedHandlers = this.chainMiddleware(handlers);
        this.routes.push({ method, path, handler: chainedHandlers });
        // Log the registration of the route
        utils_1.Debug.info(`Registered route: [${method}] ${path}`);
    }
    /**
     * Handles an incoming request by matching it to a registered route.
     * @param method - The HTTP method of the request.
     * @param path - The path of the request.
     * @param req - The incoming HTTP request.
     * @param res - The outgoing HTTP response.
     */
    handleRequest(method, path, req, res) {
        const { pathname, query } = (0, url_1.parse)(req.url, true);
        req.query = query; // Attach query params to req object
        const route = this.findRoute(method, pathname);
        if (route) {
            const params = this.extractParams(route.path, pathname);
            req.params = params; // Attach params to req object
            this.executeMiddleware([...this.middleware, route.handler], req, res);
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not Found" }));
            utils_1.Debug.error(`${method} ${path} 404`);
        }
    }
    /**
     * Finds a matching route based on method and path.
     * @param method - The HTTP method.
     * @param path - The path to match.
     * @returns The matched route or undefined if not found.
     */
    findRoute(method, path) {
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
    chainMiddleware(handlers) {
        return (req, res, next) => {
            let index = 0;
            const execute = (err) => {
                if (err)
                    return err;
                if (index >= handlers.length)
                    return next();
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
    executeMiddleware(handlers, req, res) {
        let index = 0;
        const next = (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
                utils_1.Debug.error(`Error: ${err.message}`);
                return;
            }
            if (index >= handlers.length)
                return;
            const handler = handlers[index++];
            handler(req, res, next);
        };
        next();
    }
    /**
     * Extracts parameters from the route path based on the request path.
     * @param routePath - The route's path (e.g., /user/:id).
     * @param requestPath - The actual request path.
     * @returns A dictionary of extracted parameters or null if no match.
     */
    extractParams(routePath, requestPath) {
        const routeParts = routePath.split("/");
        const requestParts = requestPath.split("/");
        if (routeParts.length !== requestParts.length)
            return null;
        const params = {};
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(":")) {
                params[routeParts[i].slice(1)] = requestParts[i];
            }
            else if (routeParts[i] !== requestParts[i]) {
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
    get(path, ...middlewares) {
        this.register("GET", path, ...middlewares);
        return this; // Return the router instance for chaining
    }
    /**
     * Registers a POST method route with the provided path and middleware functions.
     * @param path - The path for the POST route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    post(path, ...middlewares) {
        this.register("POST", path, ...middlewares);
        return this;
    }
    /**
     * Registers a PUT method route with the provided path and middleware functions.
     * @param path - The path for the PUT route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    put(path, ...middlewares) {
        this.register("PUT", path, ...middlewares);
        return this;
    }
    /**
     * Registers a DELETE method route with the provided path and middleware functions.
     * @param path - The path for the DELETE route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    delete(path, ...middlewares) {
        this.register("DELETE", path, ...middlewares);
        return this;
    }
    /**
     * Registers a PATCH method route with the provided path and middleware functions.
     * @param path - The path for the PATCH route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    patch(path, ...middlewares) {
        this.register("PATCH", path, ...middlewares);
        return this;
    }
    /**
     * Registers routes for multiple HTTP methods based on a resource handler object.
     * @param path - The base path for the resource.
     * @param middlewares - An array of middleware functions to be applied to all routes.
     * @param controller - A controller class with methods named after HTTP methods (get, post, put, delete, patch).
     */
    resource(path, middlewares, controller) {
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
exports.Router = Router;
// Create an instance of the Router
const router = new Router();
exports.router = router;
