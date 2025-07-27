import { AxiosError } from 'axios';
import { FetchQueryOptions, UseQueryOptions, UseQueryResult } from 'react-query';

import { GetAllPassengerResponse } from 'services/passenger/interface';
import { TErrorResponse } from 'services/bus';

export type TQueryKeys = [string, string];
export type TData = GetAllPassengerResponse;
export type TError = AxiosError<TErrorResponse>;

export type TPassengersQuery = (
  isInternational: boolean,
) => FetchQueryOptions<TData, TError, TData, TQueryKeys>;

export type TPassengersQueryOptions = UseQueryOptions<
  TData,
  AxiosError<TErrorResponse>,
  TData,
  TQueryKeys
>;

export type TUsePassengers = (
  isInternational: boolean,
  queryOptions?: TPassengersQueryOptions,
) => UseQueryResult<TData, TError>;
