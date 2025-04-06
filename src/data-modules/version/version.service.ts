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
        return await this.versionRepository.findOne({
            where: {},
            order: {
                releaseDate: 'DESC',
            },
        });
    }

    @Trace('VersionService.getLastVersion', {
        logInput: false,
        logOutput: true,
    })
    async updateVersion(version: string) {
        const entity = this.versionRepository.create({ version });
        await this.versionRepository.save(entity);
    }
}
