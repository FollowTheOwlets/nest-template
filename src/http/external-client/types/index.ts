import { AxiosRequestConfig } from 'axios';

export enum RqMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}



/**
 * Небольшая доработка для AxiosRequestConfig
 * Проброс хоста, метода и авторизации
 */
export type IRequestConfig = Omit<AxiosRequestConfig, 'method'> & {
  host: string;
  method: RqMethod;
  withAuth?: {
    jwt?: string;
    basic?: string;
  };
};

export type IRetryRequestConfig = IRequestConfig & {
  interval?: number;
  attempts?: number;
};
