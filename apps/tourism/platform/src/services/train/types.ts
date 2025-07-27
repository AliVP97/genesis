import { AxiosError } from 'axios';

import { definitions } from 'types/rajatrain';

export type TTrainStationType = definitions['rajaStationInfo'];
export type TErrorResponse = AxiosError<definitions['rpcStatus']>;
