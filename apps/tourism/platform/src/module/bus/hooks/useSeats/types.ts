import { AxiosError } from 'axios';
import { FetchQueryOptions, UseQueryOptions, UseQueryResult } from 'react-query';

import { BusSeatsResponse } from 'services/bus/seats/interface';
import { TErrorResponse } from 'services/bus';

export type TQueryKeys = (string | undefined)[];
export type TData = BusSeatsResponse;
export type TError = AxiosError<TErrorResponse>;

export type TSeatsQuery = (busId: string) => FetchQueryOptions<TData, TError, TData, TQueryKeys>;

export type TSeatsQueryOptions = UseQueryOptions<TData, TError, TData, TQueryKeys>;

export type TUseSeats = (
  busId?: string,
  queryOptions?: TSeatsQueryOptions,
) => UseQueryResult<TData, TError>;
