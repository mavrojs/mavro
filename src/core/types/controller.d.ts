import { Request } from './request';
import { Response } from './response';

export interface Controller {
  handleRequest: (req: Request, res: Response) => Promise<void>;
}