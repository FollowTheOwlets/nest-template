import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService as TermHealthCheckService,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('healthcheck')
export class HealthcheckController {
    constructor(
        private health: TermHealthCheckService,
        private db: TypeOrmHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([() => this.db.pingCheck('database')]);
    }
}
