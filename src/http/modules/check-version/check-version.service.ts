import { Inject, Injectable } from '@nestjs/common';
import { VersionService } from '~src/data-modules/version/version.service';
import { VERSION_KEY } from '~src/http/external-client/api/version/version.provider';
import VersionApi from '~src/http/external-client/api/version/version.api';
import { VersionNotFoundException } from '~src/http/modules/check-version/exception/version-not-found.exception';
import { AxiosResponse } from 'axios';
import { IResponse } from '~src/http/external-client/api/version/methods/get-version.method';
import { ExternalServiceException } from '~src/http/modules/check-version/exception/external-service.exception';

@Injectable()
export class CheckVersionService {
    constructor(
        private versionService: VersionService,
        @Inject(VERSION_KEY) private versionApi: VersionApi,
    ) {}

    async getLastServiceVersion() {
        const entity = await this.versionService.getLastVersion();

        if (!entity) {
            throw new VersionNotFoundException();
        }

        return {
            version: entity.version,
        };
    }

    async getExternalVersion() {
        let res: AxiosResponse<IResponse, any> | null = null;

        try {
            res = await this.versionApi.getVersion({});
        } catch (e) {
            throw new ExternalServiceException();
        }

        if (res?.status === 404) {
            throw new VersionNotFoundException();
        }
        return {
            version: res?.data.version,
        };
    }
}
