import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';
import { PostgresqlModule } from '~src/database-modules/postgresql/postgresql.module';
import { CacheModule } from '@nestjs/cache-manager';
import { VersionModule } from '~src/data-modules/version/version.module';

@Module({
    imports: [
        TerminusModule,
        PostgresqlModule,
        CacheModule.register({}),
        VersionModule,
    ],
    controllers: [HealthcheckController],
})
export class HealthcheckModule {}
