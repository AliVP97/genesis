import { components } from 'types/international-flight';

export type TInternationalTicketDetailResponse =
  components['schemas']['InternationalFlightPb.ItineraryDetailResponse'];

export type TTicketDetailPayload = {
  requestId: string;
  itineraryId: string;
};

export type TIntelFlight = components['schemas']['InternationalFlightPb.Flight'];

export type TIntelTicket = components['schemas']['InternationalFlightPb.Itinerary'];
