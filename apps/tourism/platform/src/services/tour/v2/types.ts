import { AxiosError } from 'axios';

import { definitions as passengerDefinition } from 'types/passenger';
import { definitions } from 'types/hotel';

export type TType = string;

export type TLocation = { id: string; name: string; province: string };

export type TPassengerAgeType = passengerDefinition['passengerAgeType'];

export type TErrorResponse = AxiosError<definitions['rpcStatus']>;
