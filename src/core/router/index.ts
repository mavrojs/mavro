import { Middleware } from '../types';

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: Middleware;
}

export class Router {
  private routes: Route[] = [];

  register(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', path: string, handler: Middleware) {
    this.routes.push({ method, path, handler });
  }

  handleRequest(method: string, path: string, req: any, res: any) {
    const route = this.routes.find(route => route.method === method && route.path === path);

    if (route) {
      return route.handler(req, res, () => {});
    }

    res.status(404).json({ error: 'Not Found' });
  }
}

const router = new Router();

export { router };