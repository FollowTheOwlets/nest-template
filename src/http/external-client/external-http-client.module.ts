import { ConsoleLogger, Module } from '@nestjs/common';

import APIRequest from './api-request/api-request.service';
import { ApiRequestModule } from './api-request/api-request.module';
import versionProvider from '~src/http/external-client/api/version/version.provider';

@Module({
  imports: [ApiRequestModule],
  providers: [APIRequest, ConsoleLogger, versionProvider],
  exports: [versionProvider]
})
export class ExternalHttpClientModule {}
