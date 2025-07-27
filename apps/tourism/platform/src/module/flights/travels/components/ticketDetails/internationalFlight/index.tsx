import { TripMode } from 'module/flights/travels/helper/travelHelper';
import { TInternationalTripMode } from 'services/internationalFlight/flight/interface';
import { TTrip } from 'services/trips/types';
import TravelInterNationalFlightInfo from '../../info/internationalFlight';
import TicketDetailsItem from '../ticketItem';
import InternationalFlightPriceDetails from './components/price';

type TInternationalFlightTicketProps = {
  details: TTrip;
};

const InternationalFlightTicket = ({ details }: TInternationalFlightTicketProps) => {
  const flight = details.intFlightDetails;

  return (
    <>
      <>
        <TicketDetailsItem
          title={`${
            (flight?.itinerary?.leavingFlight?.origin?.iata &&
              flight?.iataDictionary![flight?.itinerary?.leavingFlight?.origin?.iata]?.city?.name
                ?.farsi) ||
            flight?.itinerary?.leavingFlight?.origin?.iata
          } - ${
            (flight?.itinerary?.leavingFlight?.destination?.iata &&
              flight?.iataDictionary![flight?.itinerary?.leavingFlight?.destination?.iata]?.city
                ?.name?.farsi) ||
            flight?.itinerary?.leavingFlight?.destination?.iata
          }`}
          details={details}
          passengersCount={flight?.passengers ? flight?.passengers.length : 0}
        >
          <TravelInterNationalFlightInfo
            info={{
              pnr: flight?.bookingData?.reference || '',
              airline:
                (flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode &&
                  flight?.airlineDictionary &&
                  flight?.airlineDictionary[
                    flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode
                  ]?.name?.farsi) ||
                flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode ||
                '-',
              date: flight?.itinerary!.leavingFlight!.origin!.datetime ?? '',
              flightNumber: flight?.itinerary?.leavingFlight?.segments![0].flightNumber || '-',
              ticketNumber: flight?.tickets![0].ticketNumber || '-',
              return: false,
            }}
          />
        </TicketDetailsItem>
        {flight?.itinerary?.tripMode === 'TRIP_MODE_ROUND_TRIP' && (
          <>
            <TicketDetailsItem
              title={`${
                (flight?.itinerary?.returningFlight?.origin?.iata &&
                  flight?.iataDictionary![flight?.itinerary?.returningFlight?.origin?.iata]?.city
                    ?.name?.farsi) ||
                flight?.itinerary?.returningFlight?.origin?.iata
              } - ${
                (flight?.itinerary?.returningFlight?.destination?.iata &&
                  flight?.iataDictionary![flight?.itinerary?.returningFlight?.destination?.iata]
                    ?.city?.name?.farsi) ||
                flight?.itinerary?.returningFlight?.destination?.iata
              }`}
              details={details}
              passengersCount={flight?.passengers ? flight?.passengers.length : 0}
            >
              <TravelInterNationalFlightInfo
                info={{
                  pnr: flight?.bookingData?.reference || '',
                  airline:
                    (flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode &&
                      flight?.airlineDictionary &&
                      flight?.airlineDictionary[
                        flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode
                      ]?.name?.farsi) ||
                    flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode ||
                    '-',
                  date: flight?.itinerary?.returningFlight?.origin?.datetime ?? '',
                  flightNumber:
                    flight?.itinerary?.returningFlight?.segments![0].flightNumber || '-',
                  ticketNumber: flight?.tickets![1].ticketNumber || '-',
                  return: false,
                }}
              />
            </TicketDetailsItem>
          </>
        )}

        <div>
          <InternationalFlightPriceDetails
            price={flight?.itinerary?.priceInfo?.price}
            type={
              TripMode[
                flight?.itinerary?.tripMode || 'TRIP_MODE_UNDEFINED'
              ] as TInternationalTripMode
            }
          />
        </div>
      </>
    </>
  );
};

export default InternationalFlightTicket;
