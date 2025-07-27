import { UserIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import React, { ChangeEvent, useContext, useState } from 'react';
import styles from './passengerListDesktop.module.scss';
import PassengerItemDesktop from './passengerItemDesktop';
import { EmptyState } from 'assets/images';
import PassengersSearchBox from './passengerSearchBox';
import { AddPassengerResponse, GetAllPassengerResponse } from 'services/passenger/interface';
import usePassenger, { PassengerModel } from 'components/passenger/hooks/usePassenger';
import Button from 'components/button';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { useQueryClient } from 'react-query';
import { LeaderForm, ServiceName } from '.';

import Leader from './leader';

import { notify } from 'utils/notification';
import useAgeTypes from 'components/passenger/hooks/useAgeTypes';

type TPassengersListProps = {
  passengerData: GetAllPassengerResponse;
  isLoading: boolean;
  serviceName: ServiceName;
  leaderForm: LeaderForm;
  maxSelectable?: number;
  selectLeader?: boolean;
  showSelectedCount?: boolean;
  refrenceDate?: string;
};

const PassengerListDesktop = ({
  passengerData,
  isLoading,
  serviceName,
  leaderForm,
  maxSelectable,
  selectLeader,
  showSelectedCount,
  refrenceDate,
}: TPassengersListProps) => {
  const [filter, setFilter] = useState<string>('');
  const queryClient = useQueryClient();
  const {
    setSelectedPassengers,
    selectedPassengers,
    setAddModal,
    disabledPassengers,
    leader,
    setLeader,
  } = useContext<MoreButtonContext>(MoreButtonContext);
  const cachedPassengersData: { passengers: AddPassengerResponse[] } | undefined =
    queryClient.getQueryData(['passengerList', serviceName, refrenceDate]);

  const handleSelected = (selected: PassengerModel) => {
    if (setSelectedPassengers && selectedPassengers) {
      const selectedArr = [...selectedPassengers];
      const index = selectedArr.findIndex((obj) => obj.id === selected.id);
      if (index !== -1) {
        if (leader?.selectedLeader?.nationalId === selected.nationalId) {
          setLeader && setLeader(undefined);
        }
        // ID exists in the array, remove it
        selectedArr.splice(index, 1);
      } else {
        // ID does not exist in the array, add it
        selectedArr.push(selected);
      }
      setSelectedPassengers(selectedArr);
    }
  };
  const { text: selectedPassengersAgeType, passengerType: passengerTypeCount } = useAgeTypes({
    cachedPassengersData,
    selectedPassengers,
    disabledPassengers,
  });
  const passengers = usePassenger({
    list: passengerData?.passengers,
    filter: filter,
  });
  return (
    <>
      <div className="d-none d-md-block">
        <div>
          <div className={styles['passenger-list']}>
            <div className="d-flex p-3 px-3">
              <UserIcon />
              <span>لیست مسافران</span>
            </div>
            <Divider type="horizontal" />
            <div>
              {passengerData?.passengers?.length === 0 && !isLoading && (
                <div
                  style={{ height: '371px' }}
                  className="d-flex justify-content-center align-items-center flex-column"
                >
                  <EmptyState className="text-center" />
                  <span style={{ color: '#536279' }}>هنوز مسافری اضافه نکرده اید</span>
                  <Button
                    className={cn(styles['btn'], 'mt-4')}
                    onClick={() => {
                      setAddModal && setAddModal(true);
                    }}
                  >
                    افزودن مسافر جدید
                  </Button>
                </div>
              )}
            </div>
            {passengerData?.passengers?.length && passengerData?.passengers?.length > 0 ? (
              <div className="d-flex justify-content-between px-4 mt-3">
                <div>
                  <PassengersSearchBox
                    placeholder="جستجو"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                    title="جستجو مسافران"
                  />
                </div>
                <Button
                  className={styles['btn']}
                  onClick={() => {
                    setAddModal && setAddModal(true);
                  }}
                >
                  افزودن مسافر جدید
                </Button>
              </div>
            ) : null}
            {passengers.length > 0 ? (
              <div style={{ height: '320px', overflow: 'auto' }} className="mt-3 px-4 mb-3">
                {passengers.length > 0 ? (
                  <>
                    <table className={cn('w-100')}>
                      <thead className={styles['passenger-list__header']}>
                        <tr>
                          <th
                            style={{
                              paddingRight: serviceName === 'domestic-flight' ? '48px' : '12px',
                            }}
                          >
                            نام و نام خانوادگی{' '}
                          </th>
                          <th>کدملی / شماره پاسپورت</th>
                          <th>ملیت</th>
                          <th>جنسیت</th>
                          <th>تاریخ تولد</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className={styles['passenger-list__body']}>
                        {React.Children.toArray(
                          passengers?.map((passenger) => {
                            return (
                              <PassengerItemDesktop
                                handleSelected={() => {
                                  const disabledSelectedPassenger = disabledPassengers?.length || 0;
                                  if (
                                    maxSelectable &&
                                    maxSelectable + disabledSelectedPassenger ===
                                      selectedPassengers?.length
                                  ) {
                                    const remove = selectedPassengers.find((item) => {
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
                                  handleSelected(passenger);
                                }}
                                serviceName={serviceName}
                                key={passenger.id}
                                passenger={passenger}
                                refrenceDate={refrenceDate}
                              />
                            );
                          }),
                        )}
                      </tbody>
                    </table>
                    {/* <div className="d-flex align-items-center justify-content-between mb-3">
                    {selectLeader && (
                      <div style={{width: '616px', marginTop: '15px'}}>
                        <Leader leaderForm={leaderForm} />
                      </div>
                    )}

                    {selectedPassengersAgeType && (
                      <div
                        style={maxSelectable ? {width: '260px'} : undefined}
                        className={styles['selected']}
                      >
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
                  </div> */}
                    <Divider type="horizontal" />
                  </>
                ) : passengerData?.passengers &&
                  passengerData?.passengers?.length > 0 &&
                  !isLoading &&
                  passengers?.length === 0 ? (
                  <div className="d-flex  justify-content-center align-items-center flex-column">
                    <EmptyState className="text-center" />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              style={{ marginRight: '24px' }}
              className="d-flex align-items-center justify-content-between mb-3"
            >
              {selectLeader ? (
                <div style={{ width: '616px', marginTop: '15px' }}>
                  <Leader leaderForm={leaderForm} />
                </div>
              ) : (
                <div></div>
              )}

              {selectedPassengersAgeType && (
                <div
                  style={maxSelectable ? { width: '260px' } : undefined}
                  className={styles['selected']}
                >
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerListDesktop;
