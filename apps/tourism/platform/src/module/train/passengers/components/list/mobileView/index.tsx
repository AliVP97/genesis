import { CircleAddPassengerIcon } from 'assets/icons';
import React, { ChangeEvent, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';

import AddBtn from './addBtn';
import PassengerItem from './item';
import PassengersSearchBox from './serachBox';

type TPassengerListProps = {
  passengers: Array<TPassengerV2>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  setPassenger: (e: TPassengerV2) => void;
};
const PassengerList = ({
  passengers,
  selectedPassengers,
  getPassengers,
  setPassenger,
}: TPassengerListProps) => {
  const [filter, setFilter] = useState<string>('');
  return (
    <>
      <div className="mt-2">
        <PassengersSearchBox
          title="جستجو"
          placeholder="جستجو..."
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
        />
      </div>
      <div className="py-3">
        <AddBtn getPassengers={getPassengers}>
          افزودن مسافر جدید <CircleAddPassengerIcon />
        </AddBtn>
      </div>
      <div className="mb-5 pb-4">
        {React.Children.toArray(
          passengers
            .filter(
              (x) =>
                x.englishFamily?.includes(filter) ||
                x.englishName?.includes(filter) ||
                x.persianName?.includes(filter) ||
                x.persianFamily?.includes(filter),
            )
            .map((item) => (
              <>
                <PassengerItem
                  getPassengers={getPassengers}
                  passenger={item}
                  checked={!!selectedPassengers?.find((x) => x.id === item.id)}
                  setPassenger={setPassenger}
                />
              </>
            )),
        )}
      </div>
    </>
  );
};

export default PassengerList;
