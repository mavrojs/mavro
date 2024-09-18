import { app, Console } from "./core";
import { Request, Response, Next, Middleware } from "./core/types";
import { UserController } from "./controllers/user.controller";


// Define the route and attach the controller function
app.get('/', (req, res) => UserController.getUser(req, res));

// Start the server
app.listen();