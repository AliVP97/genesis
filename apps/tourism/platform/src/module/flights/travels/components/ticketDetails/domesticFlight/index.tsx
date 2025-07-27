import {
  calculateDomesticFlightTicketPrice,
  getDateTimeDetails,
} from 'module/flights/travels/helper/travelHelper';
import { TTrip } from 'services/trips/types';
import TravelFlightInfo from '../../info/flight';
import TicketDetailsItem from '../ticketItem';

import style from '../../../travels.module.scss';

type DomesticFlightTicketProps = {
  details: TTrip;
};

const DomesticFlightTicket = ({ details }: DomesticFlightTicketProps) => {
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
  const {
    date: departureCalender,
    hour: departureHour,
    minute: departureMinute,
  } = getDateTimeDetails(flightDetails?.departure?.date);

  const {
    date: returnDepartureCalender,
    hour: returnDepartureHour,
    minute: returnDepartureMinute,
  } = getDateTimeDetails(flightReturn ? flightDetailsReturn?.departure?.date : '');

  return (
    <>
      <>
        <TicketDetailsItem
          title={`${flightDetails?.departure?.airport?.city?.name?.farsi} به ${flightDetails?.arrival?.airport?.city?.name?.farsi}`}
          details={details}
          passengersCount={flight?.passengers ? flight?.passengers.length : 0}
        >
          {flight?.passengers && (
            <TravelFlightInfo
              info={{
                airline: `${flightDetails?.airline?.name}`,
                date: `${departureHour}:${departureMinute}  ${departureCalender}`,
                flightNo: `${flightDetails?.flightNumber}`,
                pnr: `${flightTickets![0].pnr}`,
                return: false,
              }}
            />
          )}
        </TicketDetailsItem>
        <div className={style.price}>
          <span className="col-6">{flightReturn ? 'مبلغ پرداختی رفت' : 'مبلغ پرداختی'}</span>
          <span className="col-6 text-4 color-primary text-start">
            {Number(
              flightTickets ? calculateDomesticFlightTicketPrice(flight.passengers!, 0) : 0,
            ).toLocaleString()}{' '}
            ریال
          </span>
        </div>
        {flightReturn && (
          <>
            <TicketDetailsItem
              title={`${flightDetailsReturn?.departure?.airport?.city?.name?.farsi} به ${flightDetailsReturn?.arrival?.airport?.city?.name?.farsi}`}
              details={details}
              passengersCount={flight?.passengers ? flight?.passengers.length : 0}
            >
              {flight?.passengers && (
                <TravelFlightInfo
                  info={{
                    airline: `${flightDetailsReturn?.airline?.name}`,
                    date: `${returnDepartureHour}:${returnDepartureMinute}  ${returnDepartureCalender}`,
                    flightNo: `${flightDetailsReturn?.flightNumber}`,
                    pnr: `${flightTicketsReturn![1].pnr}`,
                    return: false,
                  }}
                />
              )}
            </TicketDetailsItem>
            <div className={style.price}>
              <span className="col-6">مبلغ پرداختی برگشت</span>
              <span className="col-6 text-4 color-primary text-start">
                {Number(
                  flightTicketsReturn
                    ? calculateDomesticFlightTicketPrice(flight.passengers!, 1)
                    : 0,
                ).toLocaleString()}{' '}
                تومان
              </span>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default DomesticFlightTicket;
