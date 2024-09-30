export interface Request {
  body: any;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
  method: string;
  url: string;
}