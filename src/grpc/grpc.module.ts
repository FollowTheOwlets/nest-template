import { Module } from '@nestjs/common';
import { VersionModule } from '~src/grpc/modules/version/version.module';

@Module({
    imports: [VersionModule],
})
export class GrpcModule {}
