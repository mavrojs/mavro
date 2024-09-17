import { Request } from './request';
import { Response } from './response';

export type Middleware = (req: Request, res: Response, next: () => void) => void;
