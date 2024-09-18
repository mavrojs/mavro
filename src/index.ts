import { app, Router } from './core';
import { Middleware, Request, Response } from './core/types';
import { Console } from './core/utils';



const helloHandler: Middleware = (req:Request, res:Response) => {
  res.json({ message: 'Hello World' });
};


app.get('/hello', helloHandler);

// Start the server
app.listen(3000, () => {
  Console.debug('Server is running on port 3000');
});
