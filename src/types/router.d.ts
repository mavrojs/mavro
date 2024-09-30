export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Route {
  method: HttpMethod;
  path: string;
  handler: Middleware;
}