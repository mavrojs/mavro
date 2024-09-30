"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = exports.errorHandlerMiddleware = exports.loggerMiddleware = exports.MiddlewareManager = exports.Middleware = void 0;
const utils_1 = require("../utils");
/**
 * A base middleware class providing methods to be extended by custom middleware classes.
 *
 * This class is intended to be extended by other middleware classes to define custom logic
 * for handling requests, responses, and proceeding to the next middleware in the chain.
 */
class Middleware {
    /**
     * Handles the middleware process.
     *
     * @param req - The incoming request object.
     * @param res - The response object.
     * @param next - The callback function to proceed to the next middleware.
     *
     * This method should be overridden by extending middleware classes to define custom behavior.
     */
    static async handle(req, res, next) {
        next();
    }
    /**
     * Sends an unauthorized response.
     *
     * @param res - The response object used to send the response.
     * @param message - The error message to send.
     *
     * This method can be used by extending classes to send a 401 Unauthorized response.
     */
    static unauthorized(res, message) {
        res.status(401).json({ error: message });
    }
    /**
     * Sends a forbidden response.
     *
     * @param res - The response object used to send the response.
     * @param message - The error message to send.
     *
     * This method can be used by extending classes to send a 403 Forbidden response.
     */
    static forbidden(res, message) {
        res.status(403).json({ error: message });
    }
    /**
     * Sends a success response.
     *
     * @param res - The response object.
     * @param data - Data to be sent back in the response.
     */
    static success(res, data) {
        res.status(200).json({ data });
    }
}
exports.Middleware = Middleware;
/**
 * MiddlewareManager class to manage and execute an array of middlewares.
 */
class MiddlewareManager {
    constructor() {
        this.middlewares = [];
    }
    /**
     * Register a middleware.
     *
     * @param middleware - A middleware function to be added to the middleware chain.
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Executes the registered middlewares in sequence.
     *
     * @param req - The request object.
     * @param res - The response object.
     */
    async execute(req, res) {
        let index = -1;
        const run = async (i) => {
            if (i <= index)
                throw new Error("next() called multiple times");
            index = i;
            const middleware = this.middlewares[i];
            if (middleware) {
                await new Promise((resolve) => middleware(req, res, resolve));
                await run(i + 1);
            }
        };
        await run(0);
    }
}
exports.MiddlewareManager = MiddlewareManager;
/**
 * Example logger middleware.
 */
const loggerMiddleware = (req, res, next) => {
    utils_1.Debug.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
};
exports.loggerMiddleware = loggerMiddleware;
/**
 * Example error handler middleware.
 */
const errorHandlerMiddleware = async (req, res, next) => {
    try {
        await next();
    }
    catch (error) {
        utils_1.Debug.error(`${error}`);
        res.status(500).send("Internal Server Error");
    }
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
/**
 * Example 404 Not Found middleware.
 */
const notFoundMiddleware = (req, res, next) => {
    res.status(404).send("Not Found");
};
exports.notFoundMiddleware = notFoundMiddleware;
