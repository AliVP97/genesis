import cn from 'classnames';
import {
  calculateDomesticFlightTicketPrice,
  getDateTimeDetails,
} from 'module/flights/travels/helper/travelHelper';

import { TTrip } from 'services/trips/types';
import styles from '../../../../travels.module.scss';

type TripDomesticFlightDetailsProps = {
  details: TTrip;
};

export const TripDomesticFlightDetails = ({ details }: TripDomesticFlightDetailsProps) => {
  const flight = details.flightDetails;
  const flightDetails = flight?.passengers![0].tickets![0].flightInfo;
  const flightReturn = flight?.passengers![0].tickets?.length === 2;
  const flightTickets = flight?.passengers![0].tickets;
  let flightDetailsReturn = null;
  let flightTicketsReturn = null;
  if (flightReturn) {
    flightDetailsReturn = flight?.passengers![0].tickets![1].flightInfo;
    flightTicketsReturn = flight?.passengers![0].tickets;
  }

  const { date: departureCalender } = getDateTimeDetails(flightDetails?.departure?.date);

  const {
    date: returnDepartureCalender,
    hour: returnDepartureHour,
    minute: returnDepartureMinute,
  } = getDateTimeDetails(flightReturn ? flightDetailsReturn?.departure?.date : '');
  return (
    <>
      <tr
        className={cn(
          styles['travels-container__content__items__font'],
          'bg-color-surface-container color-on-surface-var',
        )}
      >
        <th
          className={cn(
            styles['travels-container__content__items__radius-right'],
            'text-center p-3',
          )}
        >
          مسیر
        </th>
        <th className="text-center">کد مرجع</th>
        <th className="text-center">شرکت هواپیمایی</th>
        <th className="text-center">تاریخ و ساعت حرکت</th>
        <th className="text-center">مبلغ پرداختی</th>
        <th className={styles['travels-container__content__items__radius-left']} />
      </tr>

      <tr className="text-3 p-5 color-on-surface">
        <td className="text-center p-4">{`${flightDetails?.departure?.airport?.city?.name?.farsi} به ${flightDetails?.arrival?.airport?.city?.name?.farsi}`}</td>
        <td className="text-center en">{flightTickets![0].pnr}</td>
        <td className="text-center">{flightDetails?.airline?.name}</td>
        <td className="text-center">{`${flightDetails?.departure?.dateHourString} - ${departureCalender}`}</td>

        <td className="text-center">{`${Number(
          flight?.passengers && flightTickets
            ? calculateDomesticFlightTicketPrice(flight?.passengers, 0)
            : 0,
        )?.toLocaleString()} ریال`}</td>
      </tr>

      {flightReturn && (
        <>
          <tr className="text-3 p-5 color-on-surface">
            <td className="text-center p-4">{`${flightDetailsReturn?.departure?.airport?.city?.name?.farsi} به ${flightDetailsReturn?.arrival?.airport?.city?.name?.farsi}`}</td>
            <td className="text-center">{flightTicketsReturn![1].pnr}</td>
            <td className="text-center">{flightDetailsReturn?.airline?.name}</td>
            <td className="text-center">{`${returnDepartureHour}:${returnDepartureMinute} - ${returnDepartureCalender}`}</td>
            <td className="text-center">{`${
              flightTicketsReturn &&
              Number(
                flight?.passengers && flightTickets
                  ? calculateDomesticFlightTicketPrice(flight?.passengers, 1)
                  : 0,
              ).toLocaleString()
            } ریال`}</td>
          </tr>
        </>
      )}
    </>
  );
};

export default TripDomesticFlightDetails;
