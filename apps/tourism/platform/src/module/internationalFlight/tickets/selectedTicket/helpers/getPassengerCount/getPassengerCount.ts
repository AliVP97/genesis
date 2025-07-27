import { components } from 'types/international-flight';

export type FareBreakdownsV2 = components['schemas']['InternationalFlightPb.FareBreakdownV2'];

export default function getPassengerCount(fareBreakdowns: FareBreakdownsV2[] | undefined) {
  if (!fareBreakdowns) {
    return 0;
  }

  return fareBreakdowns?.reduce((acc, fareBreakdown) => acc + (fareBreakdown.count ?? 0), 0);
}
