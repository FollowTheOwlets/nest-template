import { traceExporter } from '../trace-exporter';
import { FilteringSpanProcessor } from '../filtering-span-processor';
import { readTelemetryConfig } from './read-telemetry-config';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getInstrumentations } from '~src/telemetry/instrumentations';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { ConsoleLogger } from '@nestjs/common';

const telemetryConfig = readTelemetryConfig();
if (telemetryConfig.run) {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [ATTR_SERVICE_NAME]: telemetryConfig.serviceName,
        }),
    });
    provider.addSpanProcessor(new FilteringSpanProcessor(traceExporter));
    provider.register();

    registerInstrumentations({
        instrumentations: getInstrumentations(),
    });
    const consoleLogger = new ConsoleLogger('TELEMETRY_EXECUTOR');
    consoleLogger.log('OpenTelemetry initialized');

    process.on('SIGTERM', async () => {
        consoleLogger.log('Shutting down Telemetry SDK...');
        try {
            await provider.shutdown();
            consoleLogger.log('Telemetry SDK shut down successfully');
        } catch (err) {
            consoleLogger.error('Error shutting down Telemetry SDK', err);
        } finally {
            process.exit(0);
        }
    });
}
