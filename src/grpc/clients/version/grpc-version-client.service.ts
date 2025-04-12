import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { VersionService } from '~src/grpc/clients/version/interface/abstract-version.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class GrpcVersionClientService implements OnApplicationBootstrap {
    constructor(
        private versionService: VersionService,
        private logger: Logger,
    ) {}

    onApplicationBootstrap() {
        //this.versionService.get().pipe(tap((res) => this.logger.debug(res))).subscribe();
    }
}
