import { Module } from '@nestjs/common';
import { VersionModule } from '~src/grpc/modules/version/version.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [VersionModule, CacheModule.register()],
})
export class GrpcModule {}
