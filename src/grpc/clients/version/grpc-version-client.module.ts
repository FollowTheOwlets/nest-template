import { Module } from '@nestjs/common';
import { GrpcVersionClientService } from './grpc-version-client.service';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { VersionService } from '~src/grpc/clients/version/interface/abstract-version.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                inject: [ConfigService],
                name: 'VERSION_GRPC_CLIENT',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'version',
                        protoPath: join(__dirname, 'proto/version.proto'),
                        url: configService.getOrThrow('hosts.grpc.version'),
                    },
                }),
            },
        ]),
    ],
    providers: [
        GrpcVersionClientService,
        {
            inject: ['VERSION_GRPC_CLIENT'],
            provide: VersionService,
            useFactory: (client: ClientGrpc) =>
                client.getService<VersionService>('VersionService'),
        },
    ],
})
export class GrpcVersionClientModule {}
