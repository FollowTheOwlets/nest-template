import { Logger, Module } from '@nestjs/common';
import dataSourceProvider from './provider/data-source.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '~src/common-modules/config/config.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService, Logger],
            useFactory: (config: ConfigService) => {
                return config.getOrThrow('database.psql');
            },
        }),
    ],
    providers: [dataSourceProvider],
    exports: [dataSourceProvider],
})
export class PostgresqlModule {}
