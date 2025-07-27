import { AxiosError } from 'axios';

import { TErrorResponse } from 'services/bus';
import { TGetAlertPayload } from '../types';

export type TPayload = TGetAlertPayload;
export type TError = AxiosError<TErrorResponse>;
