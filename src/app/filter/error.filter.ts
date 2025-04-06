/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { CustomHttpException } from './http-exceptions.type';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { StringUtils } from '~src/utils/string.utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly traceService: TraceService) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const span = this.traceService.getSpan();

        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response<
            any,
            Record<string, any>
        > = ctx.getResponse<Response>();
        const status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object;
        let code: string | null = null;

        if (exception instanceof HttpException) {
            const responseMessage: string | object = exception.getResponse();
            message =
                typeof responseMessage === 'string'
                    ? responseMessage
                    : (responseMessage as CustomHttpException).message ||
                      responseMessage;
            if (exception instanceof CustomHttpException) {
                code = exception.getErrorCode() || null;
            }
        } else {
            message = 'Произошла непредвиденная ошибка.';
        }

        const req = ctx.getRequest();

        const rsBody = {
            _error: {
                code: code || status,
                text: message,
                details: {
                    time: new Date(),
                    method: req.method,
                    url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
                    definition_name: null,
                    stack: (exception as Error)?.stack ?? null,
                    external_error: null,
                    ...(req.x_request_id
                        ? { x_request_id: req.x_request_id }
                        : {}),
                },
            },
        };

        this.traceService.traceIncomingResponse(
            {
                code: response.statusCode,
                'x-request-id': StringUtils.toString(
                    response.getHeader('x-request-id'),
                ),
                headers: response.getHeaders(),
                body: rsBody,
            },
            span,
        );
        this.traceService.recordException(exception as Error, span);
        span.end();
        response.status(status).json(rsBody);
    }
}
