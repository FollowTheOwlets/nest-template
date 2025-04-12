import { Module } from '@nestjs/common';
import { HealthcheckModule } from '~src/http/modules/healthcheck/healthcheck.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CheckVersionModule } from './modules/check-version/check-version.module';

@Module({
    imports: [HealthcheckModule, CacheModule.register(), CheckVersionModule],
})
export class HttpModule {}
