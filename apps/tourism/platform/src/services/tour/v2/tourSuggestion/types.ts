import { definitions } from 'types/tour';
import { AxiosError } from 'axios';
import { TErrorResponse } from '../types';
import { UseQueryOptions, UseQueryResult } from 'react-query';

export type TTourTripSuggestionsResponse = definitions['tourTripSuggestionsResponse'];

export type TQueryKeys = string;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<
  TTourTripSuggestionsResponse,
  TError,
  TTourTripSuggestionsResponse,
  TQueryKeys
>;

export type TUseSuggestionTours = (
  queryOptions?: TQueryOptions,
) => UseQueryResult<TTourTripSuggestionsResponse, TError>;
