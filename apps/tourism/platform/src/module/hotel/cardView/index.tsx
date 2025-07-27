import { THotelList } from 'services/hotel/prepare/interface';
import HotelItem from './components/hotelItem';

interface Props {
  hotels: THotelList;
  duration: number;
  isMobile: boolean;
  requestId: string | undefined;
}
export const HotelCardView = ({ hotels, duration, isMobile, requestId }: Props) => {
  return (
    <>
      {hotels?.map((hotel) => (
        <HotelItem
          info={hotel}
          duration={duration}
          key={hotel.hotelId + 'hotelCardView'}
          isMobile={isMobile}
          requestId={requestId}
          uuid={hotel?.uniqueId as string}
        />
      ))}
    </>
  );
};
