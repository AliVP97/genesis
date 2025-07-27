import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import RoomPassengersItem from '../roomPassengersItem';
import { checkValidate, decreasePassenger, increasePassenger } from '../../helper';
import { notify } from 'utils/notification';

type TRoomPassengersProps = {
  passenger: HotelPassengers;
  setPassengers: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
  hotelPassengerConfig: IPassengersHotelConfig | undefined;
};
const RoomPassengers = ({
  passenger,
  setPassengers,
  hotelPassengerConfig,
}: TRoomPassengersProps) => {
  const increase = (type: THotelPassengerType) => {
    return () => {
      try {
        if (!hotelPassengerConfig) throw new Error(`خطا در دریافت تنظیمات مسافران`);
        checkValidate(type, hotelPassengerConfig, passenger);
        setPassengers((prev) => increasePassenger(prev, passenger, type));
      } catch (error) {
        notify({
          message: <span className="text-weight-500 fa">{(error as Error).message}</span>,
          type: 'error',
          config: { position: 'bottom-right' },
        });
      }
    };
  };

  const decrease = (type: THotelPassengerType) => {
    return () => setPassengers((prev) => decreasePassenger(prev, passenger, type));
  };

  return (
    <div className="d-flex flex-column">
      {
        <>
          <RoomPassengersItem
            title="بزرگسال"
            description="(12 سال به بالا)"
            count={passenger.adult}
            increase={increase('adult')}
            decrease={decrease('adult')}
            allowedMinimum={1}
          />
          <RoomPassengersItem
            title="کودک"
            description="(تا 12 سال)"
            count={passenger?.child.length}
            increase={increase('child')}
            decrease={decrease('child')}
            allowedMinimum={1}
          />
          {}
        </>
      }
    </div>
  );
};

export default RoomPassengers;
