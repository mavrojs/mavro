import { app } from './core/app';
import { Middleware, Request, Response } from './core/types';

const resWorld: Middleware = (req: Request, res: Response, next: () => void) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World! from mavro' }));
};
const reqWorld: Middleware = (req: Request, res: Response, next: () => void) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello, World! from mavro' }));
};

app.get('/mavro', resWorld);
app.post('/mavro', reqWorld);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
