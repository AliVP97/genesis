import { definitions } from 'types/tour';
import { UseQueryOptions, UseQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { TErrorResponse } from '../types';
export type TTourGetPDPResponse = definitions['tourGetPDPResponse'];
export type TTourCalendar = definitions['apitourCalendar'];
export type TTourServices = definitions['apitourServices'][];
export type TTourItinerary = definitions['tourGetPDPResponseItinerary'];
export type TTourPDPAccommodation = definitions['apitourPDPAccommodation'];
export type TRequirementDocuments = string[];
export type TTourPDPCancellationPolicy = definitions['apitourPDPCancellationPolicy'];
export type TTourCalenderData = {
  value?: string;
  label?: string;
};

export type TQueryKeys = string;
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<
  TTourGetPDPResponse,
  TError,
  TTourGetPDPResponse,
  TQueryKeys
>;

export type TUseTourDetail = (
  tourId: string,
  calenderId?: string,
  queryOptions?: TQueryOptions,
) => UseQueryResult<TTourGetPDPResponse, TError>;
