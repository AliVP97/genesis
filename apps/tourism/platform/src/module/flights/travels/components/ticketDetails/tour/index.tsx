import { TTrip } from 'services/trips/types';
import TicketDetailsItem from '../ticketItem';
import style from '../../../travels.module.scss';
import TravelTourInfo from '../../info/tour';

type TourTicketProps = {
  details: TTrip;
};

const TourTicket = ({ details }: TourTicketProps) => {
  const tourDetails = details?.tourDetail;

  return (
    <>
      <TicketDetailsItem title={tourDetails?.tourName || '--'} details={details}>
        <TravelTourInfo
          info={{
            cityName: `${tourDetails?.cityName}`,
            rrn: `${tourDetails?.rrn}`,
            hotelName: `${tourDetails?.hotelName}`,
            fromDate: `${tourDetails?.fromDate}`,
            toDate: `${tourDetails?.toDate}`,
          }}
        />
      </TicketDetailsItem>
      <div className={style['price']}>
        <span className="col-6">مجموع قیمت</span>
        <span className="col-6  color-primary text-start">
          <span className="text-5 text-weight-500">
            {Number(tourDetails?.price).toLocaleString()}
          </span>{' '}
          <span className="text-3">ریال</span>
        </span>
      </div>
    </>
  );
};

export default TourTicket;
