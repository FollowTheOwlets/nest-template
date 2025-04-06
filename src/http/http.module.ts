import { Module } from '@nestjs/common';
import { HealthcheckModule } from '~src/http/healthcheck/healthcheck.module';

@Module({
    imports: [HealthcheckModule],
})
export class HttpModule {}
