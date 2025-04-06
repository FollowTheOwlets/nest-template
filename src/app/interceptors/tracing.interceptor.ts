import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { context, Span, trace } from '@opentelemetry/api';
import { EVENTS, TRACERS } from '~src/telemetry/trace/const/const';
import { TraceService } from '~src/telemetry/trace/trace.service';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
    constructor(private readonly traceService: TraceService) {}

    intercept(
        exContext: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = exContext.switchToHttp().getRequest();
        const { method, url, headers } = request;
        const startTime = Date.now();

        return this.traceService
            .getTracer(TRACERS.CONTROLLER)
            .startActiveSpan(`Controller ${method} ${url}`, (span: Span) => {
                span.setAttribute('http.method', method);
                span.setAttribute('http.url', url);

                span.setAttribute('x-request-id', headers['x-request-id']);

                const httpSpan = this.traceService.takeHttpSpan(
                    headers['x-request-id'],
                );

                trace.setSpan(context.active(), span);

                return next.handle().pipe(
                    tap({
                        next: (response) => {
                            span.setAttribute('http.status_code', 200);
                            if (httpSpan)
                                this.traceService.event(
                                    EVENTS.HTTP_INCOMING_RESPONSE,
                                    { 'http.body': response },
                                    httpSpan,
                                );
                            this.traceService.event(
                                EVENTS.CONTROLLER_RESULT,
                                { result: response },
                                span,
                            );
                        },
                        error: (err) => {
                            this.traceService.recordException(err, span);
                            span.setAttribute(
                                'http.status_code',
                                err.status || 500,
                            );
                        },
                        finalize: () => {
                            const duration = Date.now() - startTime;
                            span.setAttribute('http.duration_ms', duration);
                            span.end();
                        },
                    }),
                );
            });
    }
}
