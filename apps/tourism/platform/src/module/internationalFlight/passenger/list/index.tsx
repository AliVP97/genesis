import { useGetInternationalFlightOrder } from 'module/internationalFlight/tickets/hooks/useGetInternationalFlightOrder';
import { useContext, useEffect, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';
import EmptyPassengers from '../components/empty';
import PassengersList from '../components/list';
import UseGetPassengers from '../hooks/useGetPassengers';
import { AuthContext } from 'context/login';

const InternationalFlightPassenger = () => {
  const { passengers, getPassengers } = UseGetPassengers();
  const { login } = useContext(AuthContext);

  const [selectedPassengers, setSelectedPassengers] = useState<Array<TPassengerV2>>([]);
  const { orderData, isLoading } = useGetInternationalFlightOrder();
  useEffect(() => {
    if (login) getPassengers();
  }, [login]);
  return (
    <>
      {orderData && passengers?.passengerList?.length === 0 ? (
        <EmptyPassengers
          orderData={orderData}
          isLoading={isLoading}
          getPassengers={getPassengers}
        />
      ) : (
        <>
          <div className=" mb-5">
            {login && passengers?.passengerList && passengers?.passengerList?.length > 0 && (
              <div className="container">
                <PassengersList
                  orderData={orderData}
                  isLoading={isLoading}
                  passengers={passengers?.passengerList || []}
                  setSelected={setSelectedPassengers}
                  selectedPassengers={selectedPassengers}
                  getPassengers={getPassengers}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default InternationalFlightPassenger;
