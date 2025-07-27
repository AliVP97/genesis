import { AirlineDictionary, FlightSegmentV2 } from '../../types/api';

/**
 * This function is responsible for filtering the airline names by passed flight
 * segment, operatingAirlineCode is checked as it existed in the dictionary if
 * that is OK then the result is true otherwise false.
 * @param dictionary Airline Dictionary of flights
 * @param airlineNames  Airline names to filter
 * @returns the filtered airline name
 */
const findByAirlineName =
  (dictionary: AirlineDictionary | undefined, airlineNames: string[]) =>
  ({ operatingAirlineCode }: FlightSegmentV2) => {
    if (!operatingAirlineCode) {
      return false;
    }

    const airlineName = dictionary?.[operatingAirlineCode]?.name?.persian;

    if (!airlineName) {
      return false;
    }

    return airlineNames.includes(airlineName);
  };

export default findByAirlineName;
