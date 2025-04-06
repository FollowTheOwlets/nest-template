import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Version } from '~src/data-modules/version/entities/version.entity';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';

@Injectable()
export class VersionService {
    constructor(
        @Inject('VERSION_REPOSITORY')
        private versionRepository: Repository<Version>,
    ) {}

    @Trace('VersionService.getLastVersion', {
        logInput: false,
        logOutput: true,
    })
    async getLastVersion() {
        const res = await this.versionRepository.query(
            `SELECT version
             from service_version
             order by release_date desc
             limit 1`,
        );
        return res[0];
    }
}
