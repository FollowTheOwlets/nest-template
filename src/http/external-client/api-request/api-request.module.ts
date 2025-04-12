import { ConsoleLogger, Module } from '@nestjs/common';

import APIRequest from './api-request.service';
import AuthStrategy from './strategy/auth-strategy.service';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { SecureService } from '~src/http/external-client/api-request/secure/secure.service';

@Module({
  providers: [APIRequest, AuthStrategy, ConsoleLogger, TraceService, SecureService],
  exports: [APIRequest, AuthStrategy, SecureService]
})
export class ApiRequestModule {}
