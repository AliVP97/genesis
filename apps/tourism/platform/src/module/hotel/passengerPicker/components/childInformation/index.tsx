import { ChildPassenger, HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import React from 'react';
import ChildSelector from '../childSelector';

type TChildInformationProps = {
  childrenPassengers: Array<ChildPassenger>;
  hotelPassengerConfig: IPassengersHotelConfig | undefined;
  setPassengers: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
};

const ChildInformation = ({
  childrenPassengers,
  hotelPassengerConfig,
  setPassengers,
}: TChildInformationProps) => {
  const selectChildAge = (e: string, item: ChildPassenger) => {
    setPassengers((prev) =>
      prev.map((x) => ({
        ...x,
        child: x?.child?.map((y) => (y === item ? { ...y, value: e } : y)),
      })),
    );
  };
  return (
    <>
      <div className="row">
        {React.Children.toArray(
          childrenPassengers?.map((item, index) => (
            <div
              className="col-md-6 px-2"
              key={index.toString() + item.value + 'hotelChildConfirmation'}
            >
              <ChildSelector
                index={index}
                hotelPassengerConfig={hotelPassengerConfig}
                value={item.value}
                selectAge={(e: string) => selectChildAge(e, item)}
              />
            </div>
          )),
        )}
      </div>
    </>
  );
};

export default ChildInformation;
