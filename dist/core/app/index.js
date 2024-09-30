"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.App = void 0;
const http_1 = require("http");
const config_1 = require("../config");
const router_1 = require("../router");
const utils_1 = require("../utils");
class App {
    /**
     * Initializes the App with a Router instance and sets up middleware.
     * @param router - The Router instance to be used by the App.
     */
    constructor(router) {
        this.middleware = [];
        /**
         * Logger middleware that logs incoming requests and the status code after the response is sent.
         * @param req - The incoming request object.
         * @param res - The outgoing response object.
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
        /**
         * 404 handler middleware that sends a 404 response and logs the request details if no route is matched.
         * @param req - The incoming request object.
         * @param res - The outgoing response object.
         * @param next - The function to pass control to the next middleware.
         */
        this.notFoundHandler = (req, res, next) => {
            // If no route is matched, send a 404 response
            if (res.statusCode === 404) {
                utils_1.Debug.status(404, `404 Not Found - ${req.method} ${req.url}`);
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not Found" }));
            }
            else {
                next();
            }
        };
        this.router = router;
        this.port = config_1.config.port;
        this.use(this.logger);
        this.use(this.notFoundHandler);
    }
    /**
     * Registers a middleware function to be applied to all incoming requests.
     * @param middleware - The middleware function to be added to the middleware stack.
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    /**
     * Registers routes for multiple HTTP methods based on a resource handler object.
     * @param path - The base path for the resource.
     * @param middlewares - An array of middleware functions to be applied to all routes.
     * @param controller - A controller class with static methods named after HTTP methods (get, post, put, delete, patch).
     */
    resource(path, middlewares, controller) {
        const { get, post, put, delete: del, patch } = controller;
        if (get) {
            this.get(path, ...middlewares, get);
        }
        if (post) {
            this.post(path, ...middlewares, post);
        }
        if (put) {
            this.put(path, ...middlewares, put);
        }
        if (del) {
            this.delete(path, ...middlewares, del);
        }
        if (patch) {
            this.patch(path, ...middlewares, patch);
        }
    }
    /**
     * Registers a GET method route with the provided path and middleware functions.
     * @param path - The path for the GET route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    get(path, ...middlewares) {
        this.router.register("GET", path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Registers a POST method route with the provided path and middleware functions.
     * @param path - The path for the POST route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    post(path, ...middlewares) {
        this.router.register("POST", path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Registers a PUT method route with the provided path and middleware functions.
     * @param path - The path for the PUT route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    put(path, ...middlewares) {
        this.router.register("PUT", path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Registers a DELETE method route with the provided path and middleware functions.
     * @param path - The path for the DELETE route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    delete(path, ...middlewares) {
        this.router.register("DELETE", path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Registers a PATCH method route with the provided path and middleware functions.
     * @param path - The path for the PATCH route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    patch(path, ...middlewares) {
        this.router.register("PATCH", path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Registers a route with a specified method, path, and handler.
     * @param method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
     * @param path - The path for the route.
     * @param middlewares - Middleware functions to be applied to the route.
     */
    route(method, path, ...middlewares) {
        this.router.register(method, path, this.wrapHandler(middlewares.pop(), middlewares));
    }
    /**
     * Wraps a route handler to include application-level middleware and handles errors.
     * @param handler - The route handler to wrap.
     * @param routeMiddleware - Middleware functions specific to the route.
     * @returns A function that applies middleware before invoking the route handler.
     */
    wrapHandler(handler, routeMiddleware) {
        return (req, res, next) => {
            const chain = [...this.middleware, ...routeMiddleware, handler];
            let index = 0;
            const applyMiddleware = async () => {
                if (index < chain.length) {
                    const currentMiddleware = chain[index++];
                    try {
                        await new Promise((resolve, reject) => {
                            currentMiddleware(req, res, (err) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        });
                        await applyMiddleware(); // Continue to the next middleware/handler
                    }
                    catch (err) {
                        utils_1.Debug.error(`${err}`);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal Server Error" }));
                    }
                }
                else {
                    next(); // All middleware processed, move to the next in line
                }
            };
            applyMiddleware(); // Start middleware chain
        };
    }
    /**
     * Starts the server and listens for incoming requests on the specified port.
     * @param port - The port to listen on.
     * @param callback - Optional callback function to run when the server starts.
     */
    listenCallback(port) {
        utils_1.Debug.log(`Server is running on port http://localhost:${port}`);
    }
    listen(port = config_1.config.port, callback = (port) => this.listenCallback(port)) {
        this.port = port;
        this.server = (0, http_1.createServer)((req, res) => {
            const method = req.method;
            const url = req.url || "/";
            // Extend res to include a json method
            const extendedRes = res;
            extendedRes.json = function (data) {
                this.writeHead(200, { "Content-Type": "application/json" });
                this.end(JSON.stringify(data));
            };
            try {
                this.router.handleRequest(method, url, req, extendedRes);
            }
            catch (err) {
                utils_1.Debug.error(`${err}`);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        });
        this.server.listen(port, () => callback(port));
    }
    /**
     * Gracefully closes the server and cleans up resources.
     * @param callback - Optional callback function to be called when the server is closed.
     */
    close(callback) {
        utils_1.Debug.log("Closing server...");
        this.server.close();
    }
}
exports.App = App;
exports.app = new App(router_1.router);
