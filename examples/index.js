const mavro = require('mavro');

const { app, Middleware, Controller, logger, debug } = mavro;


class AppMiddleware extends Middleware{
    static auth(req, res, next){
        debug.warning('Passing from authentication middleware');
        next();
    }
}

class UserController extends Controller{
    static get(req, res){
        const {uuid} = req.params;
        res.json({
            message: "Hello from this simple uuid users",
            uuid
        })
    }
}

app.get('/users/:uuid', AppMiddleware.auth, UserController.get)

app.use(logger);

app.listen(8080)