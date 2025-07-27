import { definitions, operations } from 'types/bus';

export type TGetAlertPayload = operations['Bus_GetAlert']['parameters']['query'];
export type TGetAlertResponse = definitions['busGetAlertResponse'];
export type TSetAlertPayload = definitions['busAlertRequest'];
export type TSetAlertResponse = definitions['busCreateAlertResponse'];
