import { AxiosError } from 'axios';
import { FetchQueryOptions, UseQueryOptions, UseQueryResult } from 'react-query';

import { TBusOrder } from 'services/bus/order/interface';
import { TErrorResponse } from 'services/bus';

export type TQueryKeys = (string | undefined)[];
export type TData = TBusOrder;
export type TError = AxiosError<TErrorResponse>;

export type TOrderQuery = (orderId: string) => FetchQueryOptions<TData, TError, TData, TQueryKeys>;

export type TOrderQueryOptions = UseQueryOptions<TData, TError, TData, TQueryKeys>;

export type TUseOrder = (
  orderId?: string,
  queryOptions?: TOrderQueryOptions,
) => UseQueryResult<TData, TError>;
