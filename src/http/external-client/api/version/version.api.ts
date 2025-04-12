import { Inject, Injectable } from '@nestjs/common';
import APIRequest from '../../api-request/api-request.service';
import getVersionConfig from './methods/get-version.method';

@Injectable()
class VersionApi {
  constructor(@Inject() private readonly APIRequest: APIRequest) {}

  async getVersion(payload: typeof getVersionConfig.requestType) {
    type IResponse = typeof getVersionConfig.responseType;
    return await this.APIRequest.request<IResponse>(getVersionConfig.getClient(payload));
  }
}

export default VersionApi;
