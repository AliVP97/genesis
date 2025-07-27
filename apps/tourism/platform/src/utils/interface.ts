export enum Device {
  mobile = 'mobile',
  desktop = 'desktop',
  tablet = 'tablet',
  Googlebot = 'Googlebot',
}

export enum FlightParams {
  Id = 'id',
  DepartureDate = 'departureDate',
  ReturningDate = 'returningDate',
  Adult = 'adult',
  Child = 'child',
  Infant = 'infant',
  Sort = 'sort',
  DepartureFlightId = 'departureFlightId',
}

export enum FlightInternationalParams {
  DepartureDate = 'departureDate',
  ReturningDate = 'returningDate',
  Adult = 'adult',
  Child = 'child',
  Infant = 'infant',
  DestinationType = 'destinationType',
  OriginType = 'originType',
  CabinType = 'cabinType',
  TripMode = 'tripMode',
  Gender = 'gender',
  Sort = 'sort',
}

export enum BusParams {
  DepartureDate = 'departureDate',
  Sort = 'sort',
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
// example: type AB = Override<A, { b: number }>

export type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export const serviceAvailables: Array<string> = [
  '/',
  '/flights',
  '/flights/[id]',
  '/flights/airlines/[name]',
  '/train',
  '/train/[id]',
  '/train/companies/[name]',
  '/bus',
  '/bus/[id]',
  '/international',
  '/international/[id]',
  '/hotel',
  '/hotel/[id]',
  '/tour',
  '/tour/[id]',
  '/tour/moreinfo/[name]',
];
