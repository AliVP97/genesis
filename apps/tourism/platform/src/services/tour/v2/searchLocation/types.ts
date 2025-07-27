import { AxiosError } from 'axios';
import { UseQueryOptions, UseQueryResult } from 'react-query';

import { TErrorResponse, TLocation, TType } from '../types';

export type TPayload = {
  query: string;
  type: TType;
};

export type TBody = TLocation[];

export type TQueryKeys = [string, TPayload | undefined];
export type TQueryFnData = TData;
export type TData = TBody;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<TData, TError, TData, TQueryKeys>;
export type TQuery = (searchParams: TPayload) => TQueryOptions;

export type TUseLocationSearch = (
  payload: TPayload,
  queryOptions?: TQueryOptions,
) => UseQueryResult<TData, TError>;

import { definitions } from 'types/tour';
export type TTourv1SearchZoneResponse = definitions['tourSearchZoneResponse'];
export type TSuggestionItem = definitions['tourCategoryItem'][];
