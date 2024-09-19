import { app, Console } from "./core";
import { Request, Response, Next, Middleware } from "./core/types";
import { UserController } from "./controllers/user.controller";




app.get('/', (req, res) => UserController.get(req, res));

app.listen();