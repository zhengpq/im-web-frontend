import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import ErrorHandlerMap from './request-error-handler';
import { type ErrorHandlerMapKey, type RequestResponse } from '../types';
import { BASE_URL } from '@/const/api';

const requestInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 响应拦截器
const responseSuccess = async (response: AxiosResponse) => {
  return Promise.resolve(response);
};

const responseFailed = async (error: any) => {
  const { response } = error;
  if (response) {
    if (response.data.errorCode) {
      ErrorHandlerMap[response.data.errorCode as ErrorHandlerMapKey](response.data.errorMessage);
    } else {
      ErrorHandlerMap[response.status as ErrorHandlerMapKey]();
    }
    return Promise.reject(error);
  }
  if (!window.navigator.onLine) {
    console.log('没有网络');
    return Promise.reject(new Error('请检查网络连接'));
  }
  return Promise.reject(error);
};

requestInstance.interceptors.response.use(responseSuccess, responseFailed);

function request<T>(config: AxiosRequestConfig): Promise<RequestResponse<T>>;
function request<T>(url: string, config?: AxiosRequestConfig): Promise<RequestResponse<T>>;
async function request<T>(
  urlOrConfig: string | AxiosRequestConfig,
  config?: AxiosRequestConfig,
): Promise<RequestResponse<T>> {
  const finalConfig: AxiosRequestConfig =
    typeof urlOrConfig === 'string' ? { url: urlOrConfig, ...config } : urlOrConfig;
  return requestInstance(finalConfig).then((value) => {
    return value.data;
  });
}

export default request;
