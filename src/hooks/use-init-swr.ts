// @ts-nocheck
import { type AxiosRequestConfig } from 'axios';
import useSWR from 'swr';
import { type RequestResponse } from '@/types';
import fetcher from '@/common/fetcher';

const useWrapSWR = <T>(url: string, fetcherConfig?: AxiosRequestConfig) => {
  const { data, isLoading, error } = useSWR<RequestResponse<T>>(url, async (urlValue: string) =>
    fetcher(urlValue, fetcherConfig),
  );
  return {
    data,
    isLoading,
    error,
  };
};

export default useWrapSWR;
