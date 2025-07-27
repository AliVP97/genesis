import { AxiosError } from 'axios';
import { definitions } from 'types/tour';
import { UseQueryOptions, UseQueryResult } from 'react-query';

import { TErrorResponse } from '../types';

export type TTourTripListResponse = definitions['tourTripListResponse'];
export type TTourList = definitions['apitourList'];
export type TTourTripList = definitions['apitourTripList'];

export type TQueryKeys = string;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<
  TTourTripListResponse,
  TError,
  TTourTripListResponse,
  TQueryKeys
>;

export type TUseHotTours = (
  queryOptions?: TQueryOptions,
) => UseQueryResult<TTourTripListResponse, TError>;
