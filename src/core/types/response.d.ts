import { ServerResponse } from 'http';

export interface Response extends ServerResponse {
  status: (code: number) => this;
  send: (body: any) => void;
  json: (body: any) => void;
  statusCode: number;
}