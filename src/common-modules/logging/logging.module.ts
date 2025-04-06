import { ConsoleLogger, Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [
        {
            provide: Logger,
            useClass: ConsoleLogger,
        },
        {
            inject: [Logger, ConfigService],
            provide: 'LOG',
            useFactory: (
                logger: Logger,
                config: { internalConfig: unknown },
            ) => {
                if (process.env.NODE_ENV !== 'production') {
                    logger.debug('Execution Config', config.internalConfig);
                }
            },
        },
    ],
    exports: [Logger],
})
export class LoggingModule {}
