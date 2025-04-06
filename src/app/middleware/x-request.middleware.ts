import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class XRequestMiddleware implements NestMiddleware {
    use(request: Request, _response: Response, next: NextFunction): void {
        request.headers['x-request-id'] =
            request.headers['x-request-id'] || uuidV4();
        next();
    }
}
