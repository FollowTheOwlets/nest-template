import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService as TermHealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { VersionService } from '~src/data-modules/version/version.service';

@Controller('healthcheck')
export class HealthcheckController {
    constructor(
        private health: TermHealthCheckService,
        private db: TypeOrmHealthIndicator,
        private versionService: VersionService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }

    @Get('version')
    @CacheKey('health_version')
    @CacheTTL(10000)
    version() {
        return this.versionService.getLastVersion();
    }
}
