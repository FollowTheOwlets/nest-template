import { SpanStatusCode, trace } from '@opentelemetry/api';
import { TRACERS } from '~src/telemetry/trace/const/const';

export async function traceDatabaseOperation<T>(
    name: string,
    fn: () => Promise<T>,
): Promise<T> {
    const tracer = trace.getTracer(TRACERS.TYPEORM);
    return tracer.startActiveSpan(name, async (span) => {
        try {
            const result = await fn();
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
            });
            throw error;
        } finally {
            span.end();
        }
    });
}
