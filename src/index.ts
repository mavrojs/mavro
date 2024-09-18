import { app, Router } from './core';
import { Middleware, Request, Response } from './core/types';
import { Console } from './core/utils';


const authHandler:Middleware = (req:Request, res:Response, next:()=>void) =>{
    console.log("Passing from authHandler");
    next();
}

const helloHandler: Middleware = (req:Request, res:Response) => {
  res.json({ message: 'Hello World' });
  return;
};


app.get('/hello', authHandler, helloHandler);

class HelloController{
    static async get(req:Request, res: Response): Promise<void>{
        res.json({ message: 'Hello World from get' });
        return;
    }
    static async post(req:Request, res: Response): Promise<void>{
        res.json({ message: 'Hello World from post' });
        return;
    }
    static async put(req:Request, res: Response): Promise<void>{
        res.json({ message: 'Hello World from put' });
        return;
    }
    static async delete(req:Request, res: Response): Promise<void>{
        res.json({ message: 'Hello World from delete' });
        return;
    }
    static async patch(req:Request, res: Response): Promise<void>{
        res.json({ message: 'Hello World from patch' });
        return;
    }
}

app.resource('/', [authHandler], HelloController)

// Start the server
app.listen(3000, () => {
  Console.debug('Server is running on port 3000');
});
