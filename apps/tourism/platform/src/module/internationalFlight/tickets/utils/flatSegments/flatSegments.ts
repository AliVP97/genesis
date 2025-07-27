import { FlightSegmentV2, ItineraryV2 } from '../../types/api';

/**
 * flattens segments of flight data to get all segments of flight data from
 * returning and leaving flights.
 * @param itinerary itinerary of flight data
 * @returns flatted segments of flight data
 */
const flatSegments = (itinerary: ItineraryV2): FlightSegmentV2[] => [
  ...(itinerary.leavingFlight?.segments ?? []),
  ...(itinerary.returningFlight?.segments ?? []),
];

export default flatSegments;
