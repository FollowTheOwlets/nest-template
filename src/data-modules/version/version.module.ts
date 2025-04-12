import { Module } from '@nestjs/common';
import { VersionService } from './version.service';
import { PostgresqlModule } from '~src/storage-modules/postgresql/postgresql.module';
import versionRepositoryProvider from '~src/data-modules/version/provider/version-repository.provider';

@Module({
    imports: [PostgresqlModule],
    providers: [VersionService, versionRepositoryProvider],
    exports: [VersionService],
})
export class VersionModule {}
