import { getDateTimeDetails } from 'module/flights/travels/helper/travelHelper';
import { TTrip } from 'services/trips/types';
import TravelBusInfo from '../../info/bus';
import TicketDetailsItem from '../ticketItem';
import style from '../../../travels.module.scss';

type TrainTicketProps = {
  details: TTrip;
};

const BusTicket = ({ details }: TrainTicketProps) => {
  const busDetails = details?.busDetails;
  const {
    date: departureCalender,
    hour: departureHour,
    minute: departureMinute,
  } = getDateTimeDetails(busDetails?.busInfo?.departureDate);

  return (
    <>
      <>
        <TicketDetailsItem
          title={`${busDetails?.busInfo?.originCity} - ${busDetails?.busInfo?.destinationCity}`}
          details={details}
          passengersCount={busDetails?.seats ? busDetails.seats.length : 0}
        >
          <TravelBusInfo
            info={{
              company: `${busDetails?.busInfo?.companyName}`,
              date: `${departureHour}:${departureMinute} - ${departureCalender}`,
              orderNumber: `${busDetails?.ticket?.SaleId || '--'}`,
              ticketNumber: `${busDetails?.ticket?.TicketNumber || '--'}`,
              seats: `${busDetails?.seats}`,
              return: false,
            }}
          />
        </TicketDetailsItem>
        <div className={style['price']}>
          <span className="col-6">مجموع قیمت </span>
          <span className="col-6  color-primary text-start">
            <span className="text-5 text-weight-500">
              {Number(busDetails?.totalPrice).toLocaleString()}
            </span>{' '}
            <span className="text-3">تومان</span>
          </span>
        </div>
      </>
    </>
  );
};

export default BusTicket;
