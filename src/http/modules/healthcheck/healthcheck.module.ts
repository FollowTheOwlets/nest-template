import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';
import { PostgresqlModule } from '~src/storage-modules/postgresql/postgresql.module';

@Module({
    imports: [TerminusModule, PostgresqlModule],
    controllers: [HealthcheckController],
})
export class HealthcheckModule {}
