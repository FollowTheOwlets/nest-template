import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { IRequestConfig, IRetryRequestConfig, RqMethod } from '../types';
import AuthStrategy from './strategy/auth-strategy.service';
import { REQUEST } from '@nestjs/core';
import * as https from 'https';
import { Request } from 'express';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { TRACERS } from '~src/telemetry/trace/const/const';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { ConfigService } from '@nestjs/config';
import { SecureService } from '~src/http/external-client/api-request/secure/secure.service';

@Injectable({ scope: Scope.REQUEST })
class APIRequest {
  private readonly systemHeaders: Record<string, string>;
  private static agent: https.Agent;

  constructor(
    private readonly configService: ConfigService,
    private readonly authStrategyService: AuthStrategy,
    private readonly secureService: SecureService,
    private readonly logger: ConsoleLogger,
    private readonly traceService: TraceService,
    @Inject(REQUEST) private readonly rq: Request
  ) {
    this.logger.setContext('APIRequest');
    this.systemHeaders = this.configService.getOrThrow<Record<string, string>>('service.system.headers');
  }

  async initStaticAgent(): Promise<void> {
    const ca: string = await this.secureService.cert;
    APIRequest.agent = new https.Agent({ rejectUnauthorized: false, ca });
  }

  @Trace('request', { logInput: true, logOutput: true }, TRACERS.EXTERNAL_RQ)
  async request<T>(requestConfig: IRequestConfig): Promise<AxiosResponse<T> | never> {
    if (!APIRequest.agent) await this.initStaticAgent();
    const preparedRequestConfig = this.prepareRequestConfig(requestConfig);

    const currentSpan = this.traceService.getSpan();
    currentSpan.updateName(
      `HTTP ${requestConfig.method} {${requestConfig.host}}${requestConfig.url}`
    );

    try {
      this.traceService.traceOutgoingRequest(
        {
          method: preparedRequestConfig.method,
          'x-request-id': preparedRequestConfig.headers
            ? preparedRequestConfig.headers['x-request-id']
            : '',
          url: this.configService.getOrThrow<string>(requestConfig.host) + requestConfig.url,
          headers: preparedRequestConfig.headers as Record<string, string>,
          body: preparedRequestConfig.data
        },
        currentSpan
      );

      const response = await axios.request({
        baseURL: this.configService.get<string>(requestConfig.host),
        ...preparedRequestConfig,
        httpsAgent: APIRequest.agent
      });

      this.traceService.traceOutgoingResponse(
        {
          code: response.data.code,
          'x-request-id': preparedRequestConfig.headers
            ? preparedRequestConfig.headers['x-request-id']
            : '',
          headers: { ...response.headers, ...response?.config?.headers },
          body: response.data
        },
        currentSpan
      );

      return response;
    } catch (error) {
      this.logger.error('API Request error:', error.message);
      this.traceService.recordException(error);
      throw error;
    } finally {
      currentSpan.end();
    }
  }

  private prepareRequestConfig(requestConfig: IRequestConfig): AxiosRequestConfig {
    const { data, headers, withAuth, host, url, ...rest } = requestConfig;
    const config: AxiosRequestConfig = {
      ...rest,
      url: this.configService.getOrThrow<string>(host) + url,
      headers: {
        ...this.systemHeaders,
        ...headers,
        'x-request-id': this.rq.headers['x-request-id'],
        Accept: 'application/json, text/plain',
        'Content-Type': 'application/json'
      }
    };

    if (withAuth) {
      const auth = this.authStrategyService.withAuth(withAuth);
      config.headers = { ...config.headers, ...auth };
    }

    if (![RqMethod.GET].includes(requestConfig.method) && data) {
      config.data = JSON.stringify(data);
    }
    return config;
  }

  async retry<T>(
    requestConfig: IRetryRequestConfig,
    opt: { attempts: number; interval: number }
  ): Promise<AxiosResponse<T> | never> {
    opt.attempts -= 1;
    return this.request<T>(requestConfig).catch((err) => {
      if (opt.attempts) {
        return this.retry<T>(requestConfig, { attempts: opt.attempts - 1, interval: opt.interval });
      }
      return err;
    });
  }
}

export default APIRequest;
