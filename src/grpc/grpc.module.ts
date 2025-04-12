import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { VersionModule } from '~src/grpc/modules/version/version.module';
import { GrpcClientsModule } from '~src/grpc/clients/grpc-clients.module';

@Module({
    imports: [VersionModule, CacheModule.register(), GrpcClientsModule],
})
export class GrpcModule {}
