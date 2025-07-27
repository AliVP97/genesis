import EmptyPassengerListWarning from './emptyPassengerListWarning';
import EmptyPassengersAddForm from './emptyPassengersAddForm';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

type TEmptyPassengersProps = {
  getPassengers: () => void;
  orderData: GetOrderResponseV2;
  isLoading: boolean;
};
const EmptyPassengers = ({ getPassengers, orderData, isLoading }: TEmptyPassengersProps) => {
  return (
    <>
      <div className="d-md-none mt-5 text-center">
        <EmptyPassengerListWarning getPassengers={getPassengers} />
      </div>
      <div className="d-none d-md-block my-4">
        <EmptyPassengersAddForm
          orderData={orderData}
          isLoading={isLoading}
          getPassengers={getPassengers}
        />
      </div>
    </>
  );
};

export default EmptyPassengers;
