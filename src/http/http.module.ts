import { Module } from '@nestjs/common';
import { HealthcheckModule } from '~src/http/modules/healthcheck/healthcheck.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [HealthcheckModule, CacheModule.register()],
})
export class HttpModule {}
