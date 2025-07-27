import UseGetPassengers from '../hooks/useGetPassengers';
import PassengersTable from '../components/passengers/list';
import { useEffect } from 'react';

const PassengersList = () => {
  const { passengers: list, getPassengers, passengerLoading } = UseGetPassengers();

  useEffect(() => {
    getPassengers();
  }, []);

  return (
    <>
      <PassengersTable
        isLoading={passengerLoading}
        passengers={list?.passengerList || []}
        getPassengers={getPassengers}
      />
    </>
  );
};
export default PassengersList;
