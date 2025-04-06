import { ConsoleLogger, Global, Logger, Module } from '@nestjs/common';

@Global()
@Module({
    providers: [
        {
            provide: Logger,
            useClass: ConsoleLogger,
        },
    ],
    exports: [Logger],
})
export class LoggingModule {}
