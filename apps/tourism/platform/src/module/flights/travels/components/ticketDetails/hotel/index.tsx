import { TTrip } from 'services/trips/types';
import HotelTicketHeader from './components/hotelTicketHeader';

import dayjs from 'dayjs';
import TravelHotelInfo from '../../info/hotel';

type DomesticFlightTicketProps = {
  details: TTrip;
};

const HotelTicket = ({ details }: DomesticFlightTicketProps) => {
  const hotel = details.hotelDetail;

  return (
    <>
      <>
        <div>
          <HotelTicketHeader title={hotel?.hotelInfo?.name || ''} rooms={hotel?.room?.length}>
            <TravelHotelInfo
              checkInDateTime={
                dayjs(hotel?.checkDate?.checkIn).calendar('jalali').format('YYYY/MM/DD') || ''
              }
              checkOutDateTime={
                dayjs(hotel?.checkDate?.checkOut).calendar('jalali').format('YYYY/MM/DD') || ''
              }
              location={`${hotel?.hotelInfo?.city?.province} - ${hotel?.hotelInfo?.city?.name}`}
              orderNumber={hotel?.orderNumber}
              price={hotel?.payment?.totalPrice}
            />
          </HotelTicketHeader>
        </div>
      </>
    </>
  );
};

export default HotelTicket;
