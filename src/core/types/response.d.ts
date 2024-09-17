export interface Response {
  status: (code: number) => this;
  send: (body: any) => void;
  json: (body: any) => void;
  statusCode: number;
}