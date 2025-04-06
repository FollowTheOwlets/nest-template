import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '~src/common-modules/config/config.module';

export default {
    import: [ConfigModule],
    inject: [ConfigService, Logger],
    provide: DataSource,
    useFactory: async (config: ConfigService, logger: Logger) => {
        const dataSource = new DataSource({
            ...config.getOrThrow<DataSourceOptions>('database.psql'),
            entities: [
                join(__dirname, '../../../**/entities/*.entity{.ts,.js}'),
            ],
            migrations: [
                join(
                    __dirname,
                    '../../../../dist/database-modules/postgresql/changes/*.js',
                ),
            ],
        });
        return await dataSource.initialize();
    },
};
