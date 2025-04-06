import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { VersionService } from '~src/data-modules/version/version.service';
import { GRPCTrace } from '~src/grpc/decorators/grpc-trace.decorator';

@Controller()
export class VersionController {
    constructor(private versionService: VersionService) {}

    @GrpcMethod('VersionRpcService', 'get')
    @GRPCTrace('VersionRpcService.get')
    async get() {
        return await this.versionService.getLastVersion();
    }

    @GrpcMethod('VersionRpcService', 'error')
    @GRPCTrace('VersionRpcService.error')
    error(): never {
        throw new RpcException({
            message: 'VersionRpcService Error',
            code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
}
