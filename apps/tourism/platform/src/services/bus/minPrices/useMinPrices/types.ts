import {AxiosError} from 'axios';
import {UseQueryOptions, UseQueryResult} from 'react-query';

import {TErrorResponse} from 'services/bus';
import {RequireKeys} from 'utils/interface';
import {TDaysPricesResponse} from 'services/train/tickets/interface';
import {TDaysContents} from 'containers/datepicker/datepicker/types';
import {TLocation} from 'module/bus/search/types';

export type TQueryKeys = [string, TLocation | undefined];
export type TQueryFnData = TDaysPricesResponse;
export type TData = TDaysContents;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKeys
>;
export type TQuery = (
  payload?: TLocation,
) => RequireKeys<TQueryOptions, 'queryKey' | 'queryFn'>;

export type TUseMinPrices = (
  payload?: TLocation,
  queryOptions?: TQueryOptions,
) => UseQueryResult<TData, TError>;
