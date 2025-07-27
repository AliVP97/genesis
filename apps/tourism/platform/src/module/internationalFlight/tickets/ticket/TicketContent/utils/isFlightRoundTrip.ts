enum TripMode {
  TRIP_MODE_ROUND_TRIP = 'TRIP_MODE_ROUND_TRIP',
}

const isFlightRoundTrip = (tripMode: 0 | 1 | 2 | undefined) =>
  String(tripMode) === TripMode.TRIP_MODE_ROUND_TRIP;

export default isFlightRoundTrip;
