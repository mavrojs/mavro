import { app, Console } from "./core";
import { Request, Response, Next, Middleware } from "./core/types";

// Middleware function implementation
const exempleMiddleware: Middleware = (req, res, next) => {
    Console.success("Passing through the example middleware");
    next(); // Pass control to the next middleware or route handler
};

// Controller function type
type Controller = (req: Request, res: Response) => void;

// Controller function implementation
const exempleController: Controller = (req, res) => {
    res.json({ message: "hello" });
};

// Add the middleware to the application
app.use(exempleMiddleware);

// Define the route and attach the controller function
app.get('/', exempleController);

// Start the server
app.listen();