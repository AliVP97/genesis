import React, { ChangeEvent, useContext, useState } from 'react';
import PassengersSearchBox from './passengerSearchBox';
import PassengerCard from './passengerCardMobile';
import { AddPassengerResponse, GetAllPassengerResponse } from 'services/passenger/interface';
import Spinner from 'components/spinner';
import usePassenger, { PassengerModel } from 'components/passenger/hooks/usePassenger';
import Button from 'components/button';
import styles from './passengerList.module.scss';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { EmptyState } from 'assets/images';
import { useQueryClient } from 'react-query';
import { LeaderForm, ServiceName } from '.';

import { notify } from 'utils/notification';
import useAgeTypes from 'components/passenger/hooks/useAgeTypes';
type PassengerListMobile = {
  passengerData?: GetAllPassengerResponse;
  isLoading: boolean;
  serviceName: ServiceName;
  leaderForm: LeaderForm;
  maxSelectable?: number;
  showSelectedCount?: boolean;
  refrenceDate?: string;
};

const PassengerListMobile = (props: PassengerListMobile) => {
  const { passengerData, isLoading, serviceName, maxSelectable, showSelectedCount, refrenceDate } =
    props;
  const [filter, setFilter] = useState('');
  const { selectedPassengers, setSelectedPassengers, disabledPassengers, setLeader, leader } =
    useContext<MoreButtonContext>(MoreButtonContext);
  const queryClient = useQueryClient();
  const cachedPassengersData: { passengers: AddPassengerResponse[] } | undefined =
    queryClient.getQueryData(['passengerList', serviceName, refrenceDate]);
  const handleSelected = (selected: PassengerModel) => {
    if (setSelectedPassengers && selectedPassengers) {
      const selectedArr = [...selectedPassengers];
      const index = selectedArr.findIndex((obj) => obj.id === selected.id);
      if (index !== -1) {
        // ID exists in the array, remove it
        if (leader?.selectedLeader?.nationalId === selected.nationalId) {
          setLeader && setLeader(undefined);
        }
        selectedArr.splice(index, 1);
      } else {
        // ID does not exist in the array, add it
        selectedArr.push(selected);
      }
      setSelectedPassengers(selectedArr);
    }
  };
  const { setAddModal } = useContext<MoreButtonContext>(MoreButtonContext);
  const passengers = usePassenger({
    list: passengerData?.passengers,
    filter: filter,
  });

  const { text: selectedPassengersAgeType, passengerType: passengerTypeCount } = useAgeTypes({
    cachedPassengersData,
    selectedPassengers,
    disabledPassengers,
  });

  return (
    <div className="mt-4 h-100">
      {' '}
      {!isLoading && !passengers && (
        <div className="d-flex justify-content-center align-items-center flex-column">
          <EmptyState />
          <Button
            onClick={() => {
              setAddModal && setAddModal(true);
            }}
            className={styles['btn']}
          >
            افزودن مسافر جدید
          </Button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        passengers && (
          <>
            <PassengersSearchBox
              placeholder="جستجو"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
              title="جستجو مسافران"
            />
            {passengerData?.passengers &&
              passengerData?.passengers?.length > 0 &&
              !isLoading &&
              passengers?.length === 0 && (
                <div className="d-flex  justify-content-center align-items-center flex-column">
                  <EmptyState className="text-center" />
                </div>
              )}
            <div className="d-flex flex-column gap-4 mt-4 mb-5">
              {passengers?.map((item) => {
                let name = item.persianName
                  ? item.persianName + ' ' + item.persianFamily
                  : item?.englishName + ' ' + item?.englishFamily;
                name = name.trim() ? name : (item?.nationalId as string);
                return (
                  <PassengerCard
                    refrenceDate={refrenceDate}
                    serviceName={serviceName}
                    key={item.id}
                    passengerName={name}
                    passengerId={item.id as string}
                    handleSelected={() => {
                      const disabledSelectedPassenger = disabledPassengers?.length || 0;
                      if (
                        maxSelectable &&
                        maxSelectable + disabledSelectedPassenger === selectedPassengers?.length
                      ) {
                        const remove = selectedPassengers.find((passenger) => {
                          return item.id === passenger.id;
                        });

                        if (!remove) {
                          notify({
                            type: 'error',
                            message: `امکان انتخاب بیش از ${maxSelectable} مسافر وجود ندارد`,
                          });
                          return;
                        }
                      }
                      handleSelected(item);
                    }}
                  />
                );
              })}
              {selectedPassengersAgeType && (
                <div className={styles['selected']}>
                  {selectedPassengersAgeType}
                  {maxSelectable && showSelectedCount && (
                    <div>
                      انتخاب شده :{' '}
                      {passengerTypeCount.adult +
                        passengerTypeCount.child +
                        passengerTypeCount.infant}{' '}
                      {''}
                      از {maxSelectable}
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  position: 'fixed',
                  bottom: selectedPassengersAgeType ? '80px' : '20px',
                  width: '100%',
                  right: '20px',
                }}
                dir="rtl"
              >
                <Button
                  onClick={() => {
                    setAddModal && setAddModal(true);
                  }}
                  className={styles['btn']}
                >
                  افزودن مسافر جدید
                </Button>
              </div>
              <div style={{ height: selectedPassengersAgeType ? '120px' : '60px' }}></div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default PassengerListMobile;
