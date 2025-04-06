import { Span as ApiSpan, SpanOptions } from '@opentelemetry/api';
import { TRACERS } from '~src/telemetry/trace/const/const';
import { copyMetadataFromFunctionToFunction } from '~src/telemetry/trace/utils/opentelemetry.utils';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { AttributeValue } from '@opentelemetry/api/build/src/common/Attributes';
import { StringUtils } from '~src/utils/string.utils';

const traceService = new TraceService();

const logInputHandler = (span: ApiSpan, args: AttributeValue[]) => {
    args.forEach((arg, index) => {
        if (typeof arg === 'object' && arg !== null) {
            span.setAttribute(`input.arg[${index}]`, StringUtils.toString(arg));
        } else {
            span.setAttribute(`input.arg[${index}]`, arg);
        }
    });
};

const logOutputHandler = (span: ApiSpan, result: AttributeValue) => {
    if (typeof result === 'object' && result !== null) {
        span.setAttribute('output.result', StringUtils.toString(result));
    } else {
        span.setAttribute('output.result', result);
    }
};

type SpanDecoratorOptions = {
    logInput?: boolean;
    logOutput?: boolean;
};

export function Trace(
    name?: string,
    { logInput, logOutput }: SpanDecoratorOptions = {
        logInput: false,
        logOutput: false,
    },
    tracerType: TRACERS = TRACERS.DEFAULT,
    spanOptions: SpanOptions = { root: false },
) {
    return (
        target: object,
        propertyKey: PropertyKey,
        propertyDescriptor: PropertyDescriptor,
    ) => {
        const originalFunction = propertyDescriptor.value;
        const wrappedFunction = function PropertyDescriptor(
            ...args: AttributeValue[]
        ) {
            const tracer = traceService.getTracer(tracerType);
            const spanName =
                name || `${target.constructor.name}.${String(propertyKey)}`;

            return tracer.startActiveSpan(spanName, spanOptions, (span) => {
                if (logInput) logInputHandler(span, args);

                if (originalFunction.constructor.name === 'AsyncFunction') {
                    return originalFunction
                        .apply(this, args)
                        .then((res: AttributeValue) => {
                            if (logOutput) logOutputHandler(span, res);
                            return res;
                        })
                        .catch((error: Error) => {
                            traceService.recordException(error);
                            throw error;
                        })
                        .finally(() => {
                            span.end();
                        });
                }

                try {
                    const result = originalFunction.apply(this, args);
                    if (logOutput) logOutputHandler(span, result);
                    return result;
                } catch (error) {
                    traceService.recordException(error);
                    throw error;
                } finally {
                    span.end();
                }
            });
        };

        propertyDescriptor.value = wrappedFunction;

        copyMetadataFromFunctionToFunction(originalFunction, wrappedFunction);
    };
}
