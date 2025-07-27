import { AxiosError } from 'axios';
import { UseMutationOptions, UseMutationResult } from 'react-query';

import { TErrorResponse } from 'services/bus';
import { TAddSeatBody } from 'services/bus/seats/interface';

export type TData = unknown;
export type TError = AxiosError<TErrorResponse>;
export type TVariable = TAddSeatBody;
export type TContext = unknown;

export type TAddSeatsMutationOptions = UseMutationOptions<TData, TError, TVariable, TContext>;

export type TUseAddSeats = (
  orderId?: string,
  busId?: string,
  queryOptions?: TAddSeatsMutationOptions,
) => UseMutationResult<TData, TError, TVariable, TContext>;
