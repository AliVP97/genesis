import { AxiosError } from 'axios';
import { UseQueryResult } from 'react-query';

import { TErrorResponse, TLocation } from '../types';
import { definitions } from 'types/tour';

export type TQueryKeys = string;
export type TData = TLocation[];
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = string;
export type TQuery = () => TQueryOptions;

export type TUseHotDestinations = (queryOptions?: TQueryOptions) => UseQueryResult<TData, TError>;
export type Ttourv1FrequenciesResponse = definitions['tourFrequenciesResponse'];
