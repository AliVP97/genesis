import { QueryFunction, UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';

import { definitions } from 'types/rajatrain';
import { TErrorResponse } from '../../types';

export type TQueryKeys = [string, string];
export type TQueryFnData = TData;
export type TData = definitions['rajaGetCaptchaResponse'];
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<TData, TError, TData, TQueryKeys>;
export type TQuery = (orderId: string) => TQueryOptions;
export type TQueryFunction = QueryFunction<TData, TQueryKeys>;

export type TUseCaptchaImage = (
  orderId: string,
  queryOptions?: TQueryOptions,
) => UseQueryResult<TData, TError>;
