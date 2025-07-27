import SelectedTicketItem from 'module/flights/tickets/ticket/SelectedTicketItem';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IPassenger, TPassengerV2 } from 'services/general/passenger/interface';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import EmptyPassengers from '../components/empty';
import LoginWarning from '../components/empty/loginWarning';
import PassengersList from '../components/list';
import UseAddMultiPassengers from '../hooks/useAddMultiPassengers';
import UseGetPassengers from '../hooks/useGetPassengers';
import { getTotalDomesticFlightTicketPassenger } from '../utilities/getSelectedTicketNumber';
import { IPassengersType } from './interface';
import { resetFilters } from 'utils/helpers/resetFilters';
import styles from './passengerList.module.scss';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';

const DomesticFlightPassenger = () => {
  const { passengers: list, getPassengers, passengerLoading } = UseGetPassengers();
  const { login } = useAuthContext();

  const [selectedPassengers, setSelectedPassengers] = useState<Array<TPassengerV2>>([]);
  const { selectedTicketDeparture, selectedTicketReturning, setSelectedTicketDeparture } =
    useSelectedTicket();
  const { push } = useRouter();
  useEffect(() => {
    if (login) getPassengers();
  }, [login]);
  const [passengers, setPassengers] = useState<Array<IPassenger>>([]);
  const { setLoginModalVisible } = useAuthContext();
  const { addMultiPassengers } = UseAddMultiPassengers(getPassengers);
  const [totalFormPassengers, setTotalFormPassengers] = useState<Array<IPassengersType>>(
    getTotalDomesticFlightTicketPassenger,
  );

  const domesticFlightTracking = new DomesticFlightTrackingEvent();
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  useEffect(() => {
    if (passengers.length === totalFormPassengers.length) {
      if (!login) setLoginModalVisible(true);
      else {
        addMultiPassengers(passengers);
      }
    }
  }, [passengers, login]);

  useEffect(() => {
    if (domesticFlightData !== undefined) {
      domesticFlightTracking.beginCheckout(domesticFlightData as propsModel);
    }
  }, []);
  const handleChangeTowardTicket = (changeTicket: string) => {
    if (domesticFlightData !== undefined) {
      const removeData = [selectedTicketDeparture];
      if (changeTicket === 'returningChange') removeData.push(selectedTicketReturning);
      const flightData = {
        ...domesticFlightData,
        itinerary: removeData,
      };
      domesticFlightTracking.removeFromCart(flightData as propsModel);
    }
    const query = localStorage.getItem('search-query');
    if (query) {
      if (changeTicket === 'departureChange') {
        setSelectedTicketDeparture({ selectedTicketDeparture: null });
      }
      resetFilters(JSON.parse(query), push);
    } else {
      push('/').catch(() => {
        throw new Error('try it again');
      });
    }
  };

  return (
    <>
      <div className="d-none d-md-block">
        <SelectedTicketItem
          ticket={selectedTicketDeparture!}
          onChangeTowardTicket={() => handleChangeTowardTicket('departureChange')}
        />
        {selectedTicketReturning && (
          <SelectedTicketItem
            ticket={selectedTicketReturning!}
            onChangeTowardTicket={() => handleChangeTowardTicket('returningChange')}
            isReturn={true}
          />
        )}
      </div>
      {!login ? (
        <>
          <div className="px-3 mt-2 d-md-block">
            <LoginWarning />
          </div>
          <EmptyPassengers
            setTotal={setTotalFormPassengers}
            isLoading={passengerLoading}
            isLogin={login}
            passengers={passengers}
            setPassengers={setPassengers}
            getPassengers={getPassengers}
            total={totalFormPassengers}
          />
        </>
      ) : (
        <>
          <div className={styles['passengers-list-container']}>
            <PassengersList
              isLoading={passengerLoading}
              passengers={list?.passengerList || []}
              setSelected={setSelectedPassengers}
              selectedPassengers={selectedPassengers}
              getPassengers={getPassengers}
              setTotal={setTotalFormPassengers}
              isLogin={login}
              setPassengers={setPassengers}
              total={totalFormPassengers}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DomesticFlightPassenger;
