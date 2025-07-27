import { CircleAddPassengerIcon } from 'assets/icons';
import React, { ChangeEvent, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';
import AddBtn from './addBtn';
import PassengerItem from './item';
import PassengersSearchBox from './serachBox';
import EmptyResult from '../../../../../../../components/emptyResult';

type TPassengerListProps = {
  passengers: Array<TPassengerV2>;
  getPassengers: () => void;
};
const PassengerList = ({ passengers, getPassengers }: TPassengerListProps) => {
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
      {passengers.length === 0 && <EmptyResult className="mt-3 text-center" hideButton={true} />}
      <div className="mb-5 pb-4">
        {React.Children.toArray(
          passengers
            .filter((x) => x.englishFamily?.includes(filter) || x.englishName?.includes(filter))
            .map((item) => (
              <>
                <PassengerItem getPassengers={getPassengers} passenger={item} />
              </>
            )),
        )}
      </div>
    </>
  );
};

export default PassengerList;
