import { API_HOSTS } from '../../../enum/hosts.enum';
import { IRequestConfig, RqMethod } from '../../../types';

/**
 *  Все что нужно для запроса.
 *  Можно прокинуть параметры, тело или авторизацию
 */
export interface IRequest {}

/**
 * Схема ответа внешнего сервиса
 */
export interface IResponse {
  version: string;
}

const getClient = (payload: IRequest): IRequestConfig => ({
  host: API_HOSTS.VERSION,
  url: `/v1/check-version/version`,
  method: RqMethod.GET,
  timeout: 30000
});

export default {
  getClient,
  requestType: {} as IRequest,
  responseType: {} as IResponse
};
