import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { readTelemetryConfig } from './read-telemetry-config';
import { traceExporter } from '../trace-exporter';
import { getInstrumentations } from '../instrumentations';
import { FilteringSpanProcessor } from '../filtering-span-processor';

const telemetryConfig = readTelemetryConfig();

export const otelSDK = telemetryConfig.run
    ? new NodeSDK({
          resource: new Resource({
              [ATTR_SERVICE_NAME]: telemetryConfig.serviceName,
          }),
          spanProcessor: new FilteringSpanProcessor(traceExporter),
          instrumentations: getInstrumentations(),
      })
    : null;

if (otelSDK) {
    otelSDK.start();
    process.on('SIGTERM', () => {
        console.log('Shutting down Telemetry SDK...');
        otelSDK
            .shutdown()
            .then(
                () => console.log('Telemetry SDK shut down successfully'),

                (err) =>
                    console.error('Error shutting down Telemetry SDK', err),
            )
            .finally(() => process.exit(0));
    });
}
