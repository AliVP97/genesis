import { AxiosError } from 'axios';
import { UseMutationOptions, UseMutationResult } from 'react-query';

import { TAddPassengersBody } from 'services/bus/passengers/interface';
import { TErrorResponse } from 'services/bus';

export type TData = unknown;
export type TError = AxiosError<TErrorResponse>;
export type TVariable = TAddPassengersBody;
export type TContext = unknown;

export type TAddPassengersMutationOptions = UseMutationOptions<TData, TError, TVariable, TContext>;

export type TUseAddPassengers = (
  orderId?: string,
  queryOptions?: TAddPassengersMutationOptions,
) => UseMutationResult<TData, TError, TVariable, TContext>;
