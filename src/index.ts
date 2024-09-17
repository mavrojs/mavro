import { app } from './core/app';
import { Middleware, Request, Response } from './core/types';

const helloWorld: Middleware = (req: Request, res: Response, next: () => void) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World!' }));
};

app.get('/mavro', helloWorld);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
