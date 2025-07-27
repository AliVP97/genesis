import { ItineraryV2 } from '../../types/api';
import flatSegments from './flatSegments';

describe('flatSegments', () => {
  const itinerary: ItineraryV2 = {};

  it('should return an empty array if the itinerary has no segments', () => {
    expect(flatSegments(itinerary)).toEqual([]);
  });

  it('should return an array of segments if the itinerary has segments', () => {
    itinerary.leavingFlight = {
      segments: [
        {
          operatingAirlineCode: 'AA',
        },
      ],
    };
    itinerary.returningFlight = {
      segments: [
        {
          operatingAirlineCode: 'AA',
        },
      ],
    };
    expect(flatSegments(itinerary)).toEqual([
      {
        operatingAirlineCode: 'AA',
      },
      {
        operatingAirlineCode: 'AA',
      },
    ]);
  });
});
