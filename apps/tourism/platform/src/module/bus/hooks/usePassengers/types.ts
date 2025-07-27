import { AxiosError } from 'axios';
import { FetchQueryOptions, UseQueryOptions, UseQueryResult } from 'react-query';

import { TErrorResponse } from 'services/bus';
import { TPassengerV2Response } from 'services/general/passenger/interface';

export type TQueryKeys = string;
export type TData = TPassengerV2Response;
export type TError = AxiosError<TErrorResponse>;

export type TPassengersQuery = () => FetchQueryOptions<TData, TError, TData, TQueryKeys>;

export type TPassengersQueryOptions = UseQueryOptions<
  TPassengerV2Response,
  AxiosError<TErrorResponse>,
  TPassengerV2Response,
  string
>;

export type TUsePassengers = (
  queryOptions?: TPassengersQueryOptions,
) => UseQueryResult<TData, TError>;
