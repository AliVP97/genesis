export enum RetrievalReson {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
}
export enum RetrievalSteps {
  CANCELATION = 'cancelation',
  SELECT_GROUP = 'selectGroup',
  SELECT_TICKET = 'selectTicket',
  BUTTOM_SHEET = 'buttomSheet',
  MODAL = 'modal',
}
export enum RetrievalFlightGroup {
  ONEWAY = 'oneWay',
  ROUND_TRIP = 'roundTrip',
}

export type TTripType =
  | 'TRIPTYPE_DOMESTIC_FLIGHT'
  | 'TRIPTYPE_TRAIN'
  | 'TRIPTYPE_UNDEFINED'
  | undefined;
