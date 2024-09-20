import { app, logger, Console } from "./core";
import { Request, Response, Next, Middleware } from "./core/types";
import { UserController } from "./controllers/user.controller";
import {authMiddleware} from "./middlewares/auth.middleware";

app.use(logger);
app.use(authMiddleware.handle);

app.get('/', (req, res) => UserController.get(req, res));

app.listen();

setTimeout(()=>{
    app.close();
}, 10000)