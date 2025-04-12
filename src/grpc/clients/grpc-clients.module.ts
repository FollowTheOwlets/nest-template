import { Module } from '@nestjs/common';
import { GrpcVersionClientModule } from '~src/grpc/clients/version/grpc-version-client.module';

@Module({
    imports: [GrpcVersionClientModule],
})
export class GrpcClientsModule {}
