import formatDate from './formatDate';
import formatIataCityRoute from '../../utils/formatIataCityRoute';
import getExtraInfo from './getExtraInfo';
import getTripOverview from './getTripOverview';
import { FlightDictionary } from 'module/internationalFlight/tickets/ticket/types/FlightDictionary';
import { Flight, FlightSegment } from 'module/internationalFlight/tickets/types/api';
import getAirlineDetails from '../../../utils/getAirlineDetails';

const getTripDetails = (
  flight: Flight,
  flightSegment: FlightSegment,
  dictionary: FlightDictionary,
) => {
  const airline = getAirlineDetails(flightSegment.operatingAirlineCode, dictionary);

  return {
    avatarLogo: airline.logo,
    avatarTitle: airline.name,
    codeShare: flightSegment.codeShare,
    subtitle: formatDate(flightSegment),
    technicalStop: flightSegment.technicalStop,
    title: formatIataCityRoute(flightSegment, dictionary),
    extraInfo: getExtraInfo(flight, flightSegment.fareClass),
    tripOverview: getTripOverview(flightSegment, dictionary),
  };
};

export default getTripDetails;
