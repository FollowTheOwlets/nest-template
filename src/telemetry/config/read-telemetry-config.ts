import * as dotenv from 'dotenv';
import { TelemetryConfig } from './telemetry.config';

dotenv.config();
export function readTelemetryConfig(): TelemetryConfig {
    return {
        run: true,
        serviceName: process.env.SERVICE_NAME || 'unknown',
        traceCollectorUrl:
            process.env.TRACE_COLLECTOR_URL || 'http://jaeger:4318/v1/traces',
    };
}
