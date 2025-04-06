import {
    context,
    Span,
    SpanOptions,
    SpanStatusCode,
    trace as traceAPI,
} from '@opentelemetry/api';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EVENTS, TRACERS } from '~src/telemetry/trace/const/const';
import { StringUtils } from '~src/utils/string.utils';
import { DatabaseError } from 'pg';
import { OutgoingHttpHeader } from 'http';

type TraceRequest = {
    headers:
        | Record<string, string | string[] | undefined>
        | NodeJS.Dict<OutgoingHttpHeader>;
    'x-request-id': string | null | undefined;
    url: string;
    body?: unknown;
    method: string | undefined;
};

type TraceResponse = {
    code: number;
    'x-request-id': string | null | undefined;
    headers:
        | Record<string, string | string[] | undefined>
        | NodeJS.Dict<OutgoingHttpHeader>;
    body?: unknown;
};

@Injectable()
export class TraceService {
    static SpanStorage = new Map<string, Span>();

    public getTracer(name: TRACERS) {
        return traceAPI.getTracer(name);
    }

    public getSpan(): Span {
        return (
            traceAPI.getSpan(context.active()) || this.startSpan('unknown span')
        );
    }

    public startSpan(
        name: string,
        trace: TRACERS = TRACERS.DEFAULT,
        parentSpan: Span = this.getSpan(),
        options: SpanOptions = {},
    ): Span {
        return this.getTracer(trace).startSpan(
            name,
            options,
            traceAPI.setSpan(context.active(), parentSpan),
        );
    }

    public addAttributes(
        args: Record<string, unknown>,
        span: Span = this.getSpan(),
    ) {
        span.setAttributes(this.formattedTraceArgs(args));
    }

    formattedTraceArgs(args: Record<string, unknown>): Record<string, string> {
        return Object.keys(args).reduce<Record<string, string>>((acc, el) => {
            acc[el] = args[el] ? StringUtils.toString(args[el]) : '';
            return acc;
        }, {});
    }

    public event(
        name: EVENTS,
        args: Record<string, unknown>,
        span: Span = this.getSpan(),
    ) {
        span.addEvent(name, this.formattedTraceArgs(args));
    }

    public traceIncomingRequest(
        request: TraceRequest,
        span: Span = this.getSpan(),
    ) {
        span.addEvent(
            EVENTS.HTTP_INCOMING_REQUEST,
            this.formattedTraceArgs({
                'http.url': request.url,
                'x-request-id': request['x-request-id'],
                'http.method': request.method,
                'http.headers': request.headers,
                'http.body': request.body,
            }),
        );
    }

    public traceOutgoingRequest(
        request: TraceRequest,
        span: Span = this.getSpan(),
    ) {
        span.addEvent(
            EVENTS.HTTP_OUTGOING_REQUEST,
            this.formattedTraceArgs({
                'http.url': request.url,
                'x-request-id': request['x-request-id'],
                'http.method': request.method,
                'http.headers': request.headers,
                'http.body': request.body,
            }),
        );
    }

    public traceIncomingResponse(
        response: TraceResponse,
        span: Span = this.getSpan(),
    ) {
        span.addEvent(
            EVENTS.HTTP_INCOMING_RESPONSE,
            this.formattedTraceArgs({
                'http.code': response.code,
                'x-request-id': response['x-request-id'],
                'http.headers': response.headers,
                'http.body': response.body,
            }),
        );
    }

    public traceOutgoingResponse(
        response: TraceResponse,
        span: Span = this.getSpan(),
    ) {
        span.addEvent(
            EVENTS.HTTP_OUTGOING_RESPONSE,
            this.formattedTraceArgs({
                'http.code': response.code,
                'x-request-id': response['x-request-id'],
                'http.headers': response.headers,
                'http.body': response.body,
            }),
        );
    }

    public recordException(error: Error, customSpan?: Span) {
        const currentSpan = customSpan || this.getSpan();

        currentSpan.addEvent(
            this.errorToEvent(error),
            this.formattedTraceArgs({
                'exception.message': error.message,
                'exception.stacktrace': error.stack,
                'exception.name': error.name,
            }),
        );

        currentSpan.setStatus({
            code: SpanStatusCode.ERROR,
            message: error.message,
        });
    }

    public errorToEvent(error: Error): EVENTS {
        if (error instanceof HttpException) {
            switch (error.getStatus()) {
                case HttpStatus.BAD_REQUEST:
                    return EVENTS.HTTP_BAD_REQUEST_ERROR;
                case HttpStatus.UNAUTHORIZED:
                    return EVENTS.HTTP_UNAUTHORIZED_ERROR;
                case HttpStatus.NOT_FOUND:
                    return EVENTS.HTTP_NOT_FOUND_ERROR;
                case HttpStatus.UNPROCESSABLE_ENTITY:
                    return EVENTS.HTTP_UNPROCESSABLE_ENTITY_ERROR;
                case HttpStatus.FORBIDDEN:
                    return EVENTS.HTTP_FORBIDDEN_ERROR;
                case HttpStatus.CONFLICT:
                    return EVENTS.HTTP_CONFLICT_ERROR;
            }
        }

        if (error instanceof DatabaseError) {
            return EVENTS.DATABASE_ERROR;
        }

        return EVENTS.HTTP_INTERNAL_SERVER_ERROR;
    }

    public saveHttpSpan(rqId: string, span: Span) {
        TraceService.SpanStorage.set(rqId, span);
    }

    public takeHttpSpan(rqId: string): Span | undefined {
        const span = TraceService.SpanStorage.get(rqId);
        TraceService.SpanStorage.delete(rqId);
        return span;
    }
}
