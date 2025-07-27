import { AxiosError } from 'axios';
import { UseQueryOptions, UseQueryResult } from 'react-query';

import { TErrorResponse } from '../types';

type TPromotionSliderData = {
  alt: string;
  link: string;
  sort_key: string;
  desktop_slider: string;
  mobile_slider: string;
};

export type TPromotionSlidersData = {
  data: {
    sliders: TPromotionSliderData[];
  };
};

export type TQueryKeys = string;
export type TQueryFnData = TPromotionSlidersData;
export type TData = TPromotionSliderData[];
export type TError = AxiosError<TErrorResponse>;

export type TQueryOptions = UseQueryOptions<TQueryFnData, TError, TData, TQueryKeys>;
export type TQuery = () => TQueryOptions;

export type TUsePromotionSlider = (queryOptions?: TQueryOptions) => UseQueryResult<TData, TError>;
