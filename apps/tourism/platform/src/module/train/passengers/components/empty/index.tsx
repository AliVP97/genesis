import { Dispatch, SetStateAction } from 'react';
import { IPassenger } from 'services/general/passenger/interface';
import EmptyPassengersAddForm from './emptyPassengersAddForm';

type TEmptyPassengersProps = {
  getPassengers: () => void;
  isLoading: boolean;
  isLogin: boolean;
  passengers: Array<IPassenger>;
  setPassengers: Dispatch<SetStateAction<IPassenger[]>>;
  total: ITrainEmptyPassenger[];
  setTotal: Dispatch<SetStateAction<ITrainEmptyPassenger[]>>;
};
const EmptyPassengers = ({
  getPassengers,
  setPassengers,
  passengers,
  isLoading,
  isLogin,
  setTotal,
  total,
}: TEmptyPassengersProps) => {
  return (
    <>
      <div className=" d-md-block mt-3 mb-5">
        <EmptyPassengersAddForm
          total={total}
          setTotal={setTotal}
          isLoading={isLoading}
          isLogin={isLogin}
          passengers={passengers}
          setPassengers={setPassengers}
          getPassengers={getPassengers}
        />
      </div>
    </>
  );
};

export default EmptyPassengers;
