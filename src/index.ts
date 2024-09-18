import { app, Router } from './core';
import { Middleware, Request, Response } from './core/types';

const logger: Middleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};


const helloHandler: Middleware = (req:Request, res:Response) => {
  res.json({ message: 'Hello World' });
};

app.use(logger);

app.get('/hello', helloHandler);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
