import { UserIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';

import SelectedInternationalTicket from 'module/internationalFlight/tickets/selectedTicket';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';
import { getInternationalFlightPassengerNumberByType } from '../../utilities/checkPassengerNumbersValidity';

import AddForm from './addForm';
import Footer from './footer';
import styles from './list.module.scss';
import PassengerList from './mobileView';
import PassengersSearchBox from './mobileView/serachBox';
import PassengerItem from './passengerItem';
import SelectedPassengerNumberWarning from './selectedPassengerNumberWarning';
import { useRouter } from 'next/router';
import { EmptyPassengerFlight } from 'assets/images';
import FareBreakdownV2 from '../../types/FareBreakdownV2';
import GetOrderResponseV2 from 'module/internationalFlight/checkout/types/GetOrderResponseV2';

type TPassengersListProps = {
  passengers: Array<TPassengerV2>;
  setSelected: Dispatch<SetStateAction<Array<TPassengerV2>> | []>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  orderData: GetOrderResponseV2 | undefined;
  isLoading: boolean;
};

const PassengersList = ({
  passengers,
  setSelected,
  selectedPassengers,
  getPassengers,
  orderData,
  isLoading,
}: TPassengersListProps) => {
  const { query } = useRouter();
  const setPassenger = (passenger: TPassengerV2) => {
    if (!selectedPassengers.some((x) => x.id === passenger.id))
      setSelected((prev) => [...prev, passenger]);
    else setSelected((prev) => prev.filter((x) => x.id !== passenger.id));
  };
  useEffect(() => {
    if (passengers?.length > 0 && !!query?.selectedPassenger) {
      setSelected([passengers[0]]);
    }
  }, [passengers, query]);

  const [filter, setFilter] = useState<string>('');
  const filtredPassengers = useMemo(() => {
    return passengers?.filter(
      (x) =>
        x.englishFamily?.toUpperCase().includes(filter) ||
        x.englishName?.toUpperCase().includes(filter) ||
        x.persianName?.toUpperCase().includes(filter) ||
        x.persianFamily?.toUpperCase().includes(filter),
    );
  }, [passengers, filter]);
  const fareBreakdowns = orderData?.order?.itinerary?.fareBreakdowns as
    | FareBreakdownV2[]
    | undefined;

  return (
    <>
      <div className="d-block d-md-none mt-3">
        <PassengerList
          orderData={orderData}
          getPassengers={getPassengers}
          passengers={passengers}
          setPassenger={setPassenger}
          selectedPassengers={selectedPassengers}
        />
      </div>
      <div className="d-none d-md-block">
        {orderData && (
          <div className="mt-4">
            <SelectedInternationalTicket orderData={orderData} isLoading={isLoading} />
          </div>
        )}

        <div className="my-4">
          <div className={styles['passenger-list']}>
            <div className="d-flex p-2 px-3">
              <UserIcon />
              <span>انتخاب مسافران</span>
            </div>
            <Divider type="horizontal" />
            <div dir="ltr">
              <SelectedPassengerNumberWarning
                adult={getInternationalFlightPassengerNumberByType(fareBreakdowns, 'ADULT')}
                child={getInternationalFlightPassengerNumberByType(fareBreakdowns, 'CHILD')}
                infant={getInternationalFlightPassengerNumberByType(fareBreakdowns, 'INFANT')}
              />
            </div>
            <div className="d-flex justify-content-between px-4 mt-3">
              <span>
                لطفا مسافران این سفر را از لیست زیر انتخاب کنید و یا اطلاعات مسافران جدید را اضافه
                کنید.
              </span>
              <div>
                <PassengersSearchBox
                  placeholder="جستجو مسافران"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFilter(e.target.value?.toUpperCase())
                  }
                  title="جستجو مسافران"
                  value={filter}
                  onClear={() => setFilter('')}
                />
              </div>
            </div>
            {filtredPassengers?.length ? (
              <div className="mt-3 px-4 mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className={cn('w-100')}>
                  <thead className={styles['passenger-list__header']}>
                    <tr>
                      <th></th>
                      <th>نام و نام خانوادگی به لاتین</th>
                      <th>جنسیت</th>
                      <th>کدملی</th>
                      <th>شماره پاسپورت</th>
                      <th>تاریخ انقضا پاسپورت</th>
                      <th>کشور صادر‌کننده پاسپورت</th>
                      <th>تاریخ تولد</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody className={styles['passenger-list__body']}>
                    {filtredPassengers.map((passenger) => {
                      return (
                        <PassengerItem
                          passenger={passenger}
                          setPassenger={setPassenger}
                          selectedPassengers={selectedPassengers}
                          getPassengers={getPassengers}
                          key={passenger?.id + 'passengers-items'}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center w-100 my-5 gap-3">
                <EmptyPassengerFlight />
                <div className="text-5">مسافری با اطلاعات وارد شده یافت نشد!</div>
              </div>
            )}
            <Divider type="horizontal" />
            <AddForm getPassengers={getPassengers} />
          </div>
        </div>
        <Footer
          passengers={passengers}
          selectedPassengers={selectedPassengers}
          orderData={orderData}
        />
      </div>
    </>
  );
};

export default PassengersList;
