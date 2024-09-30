import { Request } from './request';
import { Response } from './response';
import { Next } from './next';

export type Middleware = (req: Request, res: Response, next: Next) => void;