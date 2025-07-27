import cn from 'classnames';
import { TTrip } from 'services/trips/types';
import styles from '../../../../travels.module.scss';

type TripDomesticFlightDetailsProps = {
  details: TTrip;
};

export const TripInternationalFlightDetails = ({ details }: TripDomesticFlightDetailsProps) => {
  const flight = details?.intFlightDetails;
  return (
    <>
      <tr
        className={cn(
          styles['travels-container__content__items__font'],
          'bg-color-surface-container color-on-surface-var font-weight-500',
        )}
      >
        <th
          className={cn(
            styles['travels-container__content__items__radius-right'],
            'text-center p-3 w-25',
          )}
        >
          مسیر
        </th>
        <th className="text-center"> شماره PNR </th>
        <th className="text-center"> شماره پرواز </th>
        <th className="text-center"> شماره بلیط </th>
        <th className="text-center"> شرکت هواپیمایی </th>
        <th className="text-center">تاریخ و ساعت حرکت </th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">{`${
          (flight?.itinerary?.leavingFlight?.origin?.iata &&
            flight?.iataDictionary![flight?.itinerary?.leavingFlight?.origin?.iata]?.city?.name
              ?.farsi) ||
          flight?.itinerary?.leavingFlight?.origin?.iata
        } - ${
          (flight?.itinerary?.leavingFlight?.destination?.iata &&
            flight?.iataDictionary![flight?.itinerary?.leavingFlight?.destination?.iata]?.city?.name
              ?.farsi) ||
          flight?.itinerary?.leavingFlight?.destination?.iata
        }`}</td>
        <td className="text-center en">{flight?.bookingData?.reference || '-'}</td>
        <td className="text-center">
          {flight?.itinerary?.leavingFlight?.segments![0].flightNumber || '-'}
        </td>
        <td className="text-center">{flight?.tickets![0].ticketNumber || '-'}</td>
        <td className="text-center">
          {(flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode &&
            flight?.airlineDictionary &&
            flight?.airlineDictionary[
              flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode
            ]?.name?.farsi) ||
            flight?.itinerary?.leavingFlight?.segments![0].marketingAirlineCode ||
            '-'}
        </td>
        <td className="text-center ltr">{flight?.itinerary?.leavingFlight?.origin?.datetime}</td>
      </tr>

      {flight?.itinerary?.tripMode === 'TRIP_MODE_ROUND_TRIP' && (
        <>
          <tr className="text-3 p-5">
            <td className="text-center p-4">{`${
              (flight?.itinerary?.returningFlight?.origin?.iata &&
                flight?.iataDictionary![flight?.itinerary?.returningFlight?.origin?.iata]?.city
                  ?.name?.farsi) ||
              flight?.itinerary?.returningFlight?.origin?.iata
            } - ${
              (flight?.itinerary?.returningFlight?.destination?.iata &&
                flight?.iataDictionary![flight?.itinerary?.returningFlight?.destination?.iata]?.city
                  ?.name?.farsi) ||
              flight?.itinerary?.returningFlight?.destination?.iata
            }`}</td>
            <td className="text-center en">{flight?.bookingData?.reference || '-'}</td>
            <td className="text-center">
              {flight?.itinerary?.returningFlight?.segments![0].flightNumber || '-'}
            </td>
            <td className="text-center">{flight?.tickets![1].ticketNumber || '-'}</td>
            <td className="text-center">
              {(flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode &&
                flight?.airlineDictionary &&
                flight?.airlineDictionary[
                  flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode
                ]?.name?.farsi) ||
                flight?.itinerary?.returningFlight?.segments![0].marketingAirlineCode ||
                '-'}
            </td>
            <td className="text-center ltr">
              {flight?.itinerary?.returningFlight?.origin?.datetime}
            </td>
          </tr>
        </>
      )}
    </>
  );
};

export default TripInternationalFlightDetails;
