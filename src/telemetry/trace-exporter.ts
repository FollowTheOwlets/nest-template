import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { readTelemetryConfig } from './config/read-telemetry-config';

const telemetryConfig = readTelemetryConfig();

export const traceExporter = new OTLPTraceExporter({
    url: telemetryConfig.traceCollectorUrl,
});
