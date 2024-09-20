import { app, logger, Console } from "./core";
import { Request, Response, Next, Middleware } from "./core/types";
import { UserController } from "./controllers/user.controller";
import { authMiddleware } from "./middlewares/auth.middleware";

app.use(logger);
app.use(authMiddleware.handle);

app.get("/", (req, res) => {
  // Force an error by calling an undefined method
  try {
    //@ts-ignore
    res.closed(); // This will trigger an error
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

app.listen();