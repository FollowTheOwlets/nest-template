import {
    ExpressInstrumentation,
    ExpressLayerType,
} from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { ClientRequest, IncomingMessage } from 'http';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { StringUtils } from '~src/utils/string.utils';
import { EVENTS } from '~src/telemetry/trace/const/const';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';

const traceService = new TraceService();

export function getInstrumentations() {
    return [
        new GrpcInstrumentation(),
        new HttpInstrumentation({
            disableOutgoingRequestInstrumentation: true,
            requestHook: (span, request: ClientRequest | IncomingMessage) => {
                request = request as IncomingMessage;

                if (request.url) {
                    const path = new URL(request.url, 'http://example.com')
                        .pathname;
                    span.updateName(`HTTP ${request.method} ${path}`);
                }

                const buffers: Uint8Array[] = [];

                request.on('data', (chunk: Uint8Array) => {
                    buffers.push(chunk);
                });

                request.on('end', () => {
                    const requestId = StringUtils.toString(
                        request.headers['x-request-id'],
                    );
                    traceService.saveHttpSpan(requestId, span);
                    span.setAttribute('x-request-id', requestId);
                    traceService.traceIncomingRequest(
                        {
                            'x-request-id': requestId,
                            headers: request.headers,
                            url: request.url || '',
                            method: request.method || '',
                            body: Buffer.concat(buffers).toString(),
                        },
                        span,
                    );
                });
            },
        }),
        new ExpressInstrumentation({
            ignoreLayersType: [
                ExpressLayerType.REQUEST_HANDLER,
                ExpressLayerType.MIDDLEWARE,
                ExpressLayerType.ROUTER,
            ],
            requestHook: (span, req) => {
                span.setAttribute('http.route', req.route || 'unknown');
            },
        }),
        new PgInstrumentation({
            requireParentSpan: true,
            enhancedDatabaseReporting: true,
            requestHook: (span, rq) => {
                if (rq.query) {
                    traceService.event(
                        EVENTS.POSTGRESQL_QUERY,
                        {
                            text: rq.query.text,
                            values: rq.query.values,
                        },
                        span,
                    );
                }
            },
            responseHook: (span, rs) => {
                if (rs.data) {
                    traceService.event(
                        EVENTS.POSTGRESQL_QUERY_RESULT,
                        {
                            command: rs.data.command,
                            rowCount: rs.data.rowCount,
                            rows: rs.data.rows,
                        },
                        span,
                    );
                }
            },
        }),
        new TypeormInstrumentation({
            enableInternalInstrumentation: true,
        }),
    ];
}
