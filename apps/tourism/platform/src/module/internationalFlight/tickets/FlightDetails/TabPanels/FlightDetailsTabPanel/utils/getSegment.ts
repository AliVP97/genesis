import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { Flight, FlightSegment } from 'module/internationalFlight/tickets/types/api';
import { Segment } from '../types/common';
import getStopDetails from './getStopDetails';
import getTripDetails from './getTripDetails';

const getSegment =
  (dictionary: FlightDictionary, flight: Flight) =>
  (flightSegment: FlightSegment): Segment => ({
    tripDetails: getTripDetails(flight, flightSegment, dictionary),
    stopDetails: getStopDetails(flightSegment, dictionary),
  });

export default getSegment;
