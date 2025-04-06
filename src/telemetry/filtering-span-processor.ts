import {
    BatchSpanProcessor,
    ReadableSpan,
} from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export class FilteringSpanProcessor extends BatchSpanProcessor {
    constructor(
        exporter: OTLPTraceExporter,
        private ignoreAttribute: string = 'otel.custom_ignore',
    ) {
        super(exporter);
    }
    onEnd(span: ReadableSpan) {
        if (span.attributes?.[this.ignoreAttribute]) {
            return; // Пропускаем спаны с флагом
        }
        super.onEnd(span);
    }
}
