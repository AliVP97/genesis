import { useEffect, useState } from 'react';
import { IPassenger, TPassengerV2 } from 'services/general/passenger/interface';
import { useAuthContext } from 'utils/hooks/useAuthContext';

import PassengerDesktopTickets from '../components/passengerDesktopTicket';
import EmptyPassengers from '../components/empty';
import LoginWarning from '../components/empty/loginWarning';
import PassengersList from '../components/list';
import UseAddMultiPassengers from '../hooks/useAddMultiPassengers';
import UseGetPassengers from '../hooks/useGetPassengers';
import { getTotalTrainTicketPassenger } from './helper';
import styles from './passengerList.module.scss';

const TrainPassenger = () => {
  const { passengers: list, getPassengers, passengerLoading } = UseGetPassengers();
  const { login } = useAuthContext();
  const [selectedPassengers, setSelectedPassengers] = useState<Array<TPassengerV2>>([]);

  useEffect(() => {
    getPassengers();
  }, [login]);

  const [passengers, setPassengers] = useState<Array<IPassenger>>([]);
  const { setLoginModalVisible } = useAuthContext();
  const { addMultiPassengers } = UseAddMultiPassengers(getPassengers);
  const [total, setTotal] = useState<Array<ITrainEmptyPassenger>>(getTotalTrainTicketPassenger());

  useEffect(() => {
    if (passengers.length === total?.length) {
      if (!login) setLoginModalVisible(true);
      else {
        addMultiPassengers(passengers);
      }
    }
  }, [passengers, login]);

  return (
    <>
      <div className="d-none d-md-block">
        <PassengerDesktopTickets />
      </div>
      {!login ? (
        <>
          <div className="px-3 mt-2  d-md-block">
            <LoginWarning />
          </div>
          <EmptyPassengers
            setTotal={setTotal}
            isLoading={passengerLoading}
            isLogin={login}
            passengers={passengers}
            setPassengers={setPassengers}
            getPassengers={getPassengers}
            total={total}
          />
        </>
      ) : (
        <>
          <div className={styles['passengers-list']}>
            <PassengersList
              isLoading={passengerLoading}
              passengers={list?.passengerList || []}
              setSelected={setSelectedPassengers}
              selectedPassengers={selectedPassengers}
              getPassengers={getPassengers}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TrainPassenger;
