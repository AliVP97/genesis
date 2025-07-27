import { Trash } from 'assets/icons';
import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';
import RoomPassengers from '../roomPassengers';
import ChildInformation from '../childInformation';

type RoomProps = {
  index: number;
  passenger: HotelPassengers;
  setPassengers: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
  removeRoom: (passenger: HotelPassengers) => void;
  hotelPassengerConfig: IPassengersHotelConfig | undefined;
  passengers: HotelPassengers[];
};

const Room = ({
  index,
  passenger,
  removeRoom,
  setPassengers,
  hotelPassengerConfig,
  passengers,
}: RoomProps) => {
  return (
    <>
      <div className="d-flex flex-column rtl border-top m-3 pt-3">
        {passengers.length > 1 && (
          <div className="d-flex justify-content-between cursor-pointer">
            <b>اتاق {PersianIndexNumber[index]}</b>
            {
              <small className="color-red" onClick={() => removeRoom(passenger)}>
                {' '}
                <Trash /> حذف اتاق {PersianIndexNumber[index]}{' '}
              </small>
            }
          </div>
        )}
        <RoomPassengers
          hotelPassengerConfig={hotelPassengerConfig}
          passenger={passenger}
          setPassengers={setPassengers}
        />
        <div>
          {passenger?.child.length > 0 && (
            <ChildInformation
              hotelPassengerConfig={hotelPassengerConfig}
              childrenPassengers={passenger?.child}
              setPassengers={setPassengers}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Room;
