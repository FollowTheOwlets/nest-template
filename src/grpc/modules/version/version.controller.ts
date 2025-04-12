import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { VersionService } from '~src/data-modules/version/version.service';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';

@Controller()
export class VersionController {
    constructor(private versionService: VersionService) {}

    @GrpcMethod('VersionService', 'get')
    @GRPCTrace('VersionService.get')
    async get() {
        return await this.versionService.getLastVersion();
    }

    @GrpcMethod('VersionService', 'error')
    @GRPCTrace('VersionService.error')
    error(): never {
        throw new RpcException({
            message: 'VersionService Error',
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
}
