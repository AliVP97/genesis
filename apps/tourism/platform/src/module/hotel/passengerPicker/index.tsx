import React from 'react';
import { HotelPassengers } from '../ticketsSearchBox/interface';
import Room from './components/room';
import AddRoom from './components/addRoomButton';
import useGetHotelPassengerConfig from './hooks/useGetHotelPassengerConfig';
import Button from 'components/button';
import styles from './passengerPicker.module.scss';

type THotelPassengerPickerProps = {
  passengers: Array<HotelPassengers>;
  setPassengers: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
  onSubmit: () => void;
};

const HotelPassengerPicker = ({
  passengers,
  setPassengers,
  onSubmit,
}: THotelPassengerPickerProps) => {
  const removeRoom = (passenger: HotelPassengers) => {
    const passengersList = passengers.filter((x) => x != passenger);
    setPassengers(passengersList);
  };
  const { hotelPassengerConfig } = useGetHotelPassengerConfig();
  return (
    <div className={styles['passenger-picker']}>
      <div>
        {React.Children.toArray(
          passengers?.map((item, index) => {
            return (
              <>
                <Room
                  index={index}
                  passenger={item}
                  setPassengers={setPassengers}
                  removeRoom={removeRoom}
                  hotelPassengerConfig={hotelPassengerConfig}
                  passengers={passengers}
                />
              </>
            );
          }),
        )}
        <div>
          <div>
            {Number(hotelPassengerConfig?.limitRooms) > passengers.length && (
              <AddRoom setPassenger={setPassengers} />
            )}

            <div className={styles['submit-button-wrap']}>
              <Button
                onClick={onSubmit}
                className="d-block mt-3 w-100 btn btn-primary mb-2"
                radius
                disabled={passengers.some((x) => x.child.some((y) => !y.value))}
              >
                تایید
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPassengerPicker;
