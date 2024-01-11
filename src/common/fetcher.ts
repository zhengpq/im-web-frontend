import axios, { type AxiosRequestConfig } from 'axios';
import ErrorHandlerMap from './request-error-handler';
import { type ErrorHandlerMapKey, type RequestResponse } from '../types';
import { BASE_URL } from '@/const/api';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
});

const fetcher = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<RequestResponse<T>> => {
  try {
    const response = await instance({ url, ...config });
    const responseData: RequestResponse<T> = response.data; // 将响应数据解析为 RequestResponse<T> 类型
    return responseData; // 从 RequestResponse<T> 中提取 data 属性
  } catch (error: any) {
    const { response } = error;
    if (response) {
      if (response.data.errorCode) {
        ErrorHandlerMap[response.data.errorCode as ErrorHandlerMapKey](response.data.errorMessage);
      } else {
        ErrorHandlerMap[response.status as ErrorHandlerMapKey]();
      }
    }
    throw new Error(error);
  }
};

export default fetcher;
