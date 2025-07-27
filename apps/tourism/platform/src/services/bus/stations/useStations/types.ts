import { AxiosError } from 'axios';
import { UseQueryOptions, UseQueryResult } from 'react-query';
import { TBusStations } from '../interface';
import { TErrorResponse } from 'services/bus';
import { RequireKeys } from 'utils/interface';

type TSearchValue = string;
type TPayload = TSearchValue;

export type TQueryKeys = [string, TPayload];
export type TQueryFnData = TData;
export type TData = TBusStations;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<TData, TError, TData, TQueryKeys>;
export type TQuery = (searchValue: TPayload) => RequireKeys<TQueryOptions, 'queryKey' | 'queryFn'>;

export type TUseStations = (
  payload: TPayload,
  queryOptions?: TQueryOptions,
) => UseQueryResult<TData, TError>;
