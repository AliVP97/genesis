import React, { useContext, useMemo } from 'react';
import styles from './passengerCard.module.scss';

import More from '../deletePassenger/more';
import Checkbox from 'components/checkbox';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { useQueryClient } from 'react-query';
import { AddPassengerResponse } from 'services/passenger/interface';
type PassengerCard = {
  passengerName: string;
  passengerId: string;
  handleSelected: () => void;
  serviceName: string;
  refrenceDate?: string;
};
const PassengerCard = (props: PassengerCard) => {
  const { passengerName, passengerId, handleSelected, serviceName, refrenceDate } = props;
  const queryClient = useQueryClient();
  const cachedData: { passengers: AddPassengerResponse[] } | undefined = queryClient.getQueryData([
    'passengerList',
    serviceName,
    refrenceDate,
  ]);

  const { selectedPassengers, setEditModal, setSelectedPassenger, disabledPassengers } =
    useContext<MoreButtonContext>(MoreButtonContext);
  const selectable = serviceName !== 'passenger' ? true : false;
  const index = useMemo(() => {
    if (selectable) {
      return selectedPassengers?.findIndex((obj) => obj.id === passengerId);
    }
  }, [selectedPassengers, passengerId, serviceName]);
  const isNeedEdit = useMemo(() => {
    if (cachedData && selectable) {
      const passengers = cachedData?.passengers;
      for (const passenger of passengers) {
        if (passenger?.fields && passenger.id === passengerId) {
          for (const field of passenger?.fields) {
            if (!field.isOptional && !field?.value) {
              return true;
            }
          }
          break;
        }
      }
    }
    return false;
  }, [passengerId, cachedData, serviceName]);

  return (
    <div
      style={disabledPassengers?.includes(passengerId) ? { pointerEvents: 'none' } : undefined}
      className={styles['passenger-card']}
    >
      <div>
        {selectable && index !== -1 && isNeedEdit ? (
          <div
            onClick={() => {
              if (setSelectedPassenger && setEditModal) {
                setSelectedPassenger({ id: passengerId, name: passengerName });
                setEditModal(true);
              }
            }}
          >
            ویرایش
          </div>
        ) : (
          <More passengerName={passengerName} passengerId={passengerId} />
        )}
      </div>
      <div className="d-flex align-items-center gap-1">
        <div className={'d-flex flex-column rtl'}>
          <div>{passengerName}</div>
          {selectable && index !== -1 && isNeedEdit && (
            <div style={{ color: '#BB1614' }}>
              اطلاعات این مسافر کامل نیست و نیاز به ویرایش دارد.
            </div>
          )}
        </div>
        {selectable && (
          <div onClick={handleSelected}>
            <Checkbox
              disabled={disabledPassengers?.includes(passengerId)}
              style={
                index !== -1 && isNeedEdit
                  ? { background: '#BB1614', borderColor: '#BB1614' }
                  : undefined
              }
              checked={index === -1 ? false : true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerCard;
