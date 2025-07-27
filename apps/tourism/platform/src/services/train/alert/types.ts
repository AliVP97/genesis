import { definitions, operations } from 'types/rajatrain';

export type TGetAlertPayload = operations['Train_GetAlert']['parameters']['query'];
export type TGetAlertResponse = definitions['rajaGetAlertResponse'];
export type TSetAlertPayload = definitions['rajaAlertRequest'];
export type TSetAlertResponse = definitions['rajaAlertResponse'];
