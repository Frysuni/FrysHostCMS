import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useSystemStore } from '@/store/system';
import { getAccess } from './auth';
import { ApiError } from './apiError';

export type Params = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH',
  pathname: string,
  query?: { [key: string]: string | undefined },
  body?: { [key: string]: string | undefined },
  auth?: true,
  recaptchaCode?: string,
  withCredentials?: true,
  preventErrorHandling?: boolean,
  axiosRequestConfig?: AxiosRequestConfig,
}

export async function Request<T>(params: Params): Promise<T | never> {
  let auth: string | undefined = undefined;
  if (params.auth) {
    const accessToken = await getAccess();
    if (!accessToken) throw Error('Unauth');
    auth = `Bearer ${accessToken}`;
  }

  const requestParams: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000',
    url: params.pathname,
    method: params.method,
    data: params.body,
    params: params.query,
    withCredentials: params.withCredentials,
    headers: {
      Authorization: auth,
      recaptcha: params.recaptchaCode,
      'Content-Type': params.body && Object.keys(params.body).length ? 'application/json' : undefined,
      Accept: 'application/json',
    },
    ...params.axiosRequestConfig
  };

  const req = axios.request<T>(requestParams);

  if (!params.preventErrorHandling) {
    req.catch((e: ApiError) => {
      const data = e.response?.data;
      const description = `${e.config?.url} - ${data ? `${data.statusCode}\r\n${data.message}` : 'API недоступен' }`
      useSystemStore().addError({ title: 'Ошибка запроса к серверу', description });
      throw e;
    });
  }
  
  return (await req).data;
}
