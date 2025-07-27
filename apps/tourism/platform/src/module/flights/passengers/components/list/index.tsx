import { UserIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState, useEffect } from 'react';
import { IPassenger, TPassengerV2 } from 'services/general/passenger/interface';

import AddForm from './addForm';
import Footer from './footer';
import styles from './list.module.scss';
import PassengerList from './mobileView';
import PassengersSearchBox from './mobileView/serachBox';
import PassengerItem from './passengerItem';
import EmptyPassengersAddForm from '../empty/emptyPassengersAddForm';
import { IPassengersType } from '../../list/interface';

type TPassengersListProps = {
  passengers: Array<TPassengerV2>;
  setSelected: Dispatch<SetStateAction<Array<TPassengerV2>> | []>;
  selectedPassengers: Array<TPassengerV2>;
  getPassengers: () => void;
  isLoading: boolean;
  isLogin: boolean;
  setPassengers: Dispatch<SetStateAction<IPassenger[]>>;
  total: Array<IPassengersType>;
  setTotal: Dispatch<SetStateAction<IPassengersType[]>>;
};

const PassengersList = ({
  passengers,
  setSelected,
  selectedPassengers,
  getPassengers,
  total,
  setTotal,
  isLoading,
  isLogin,
  setPassengers,
}: TPassengersListProps) => {
  const setPassenger = (passenger: TPassengerV2) => {
    if (!selectedPassengers.some((x) => x.id === passenger.id))
      setSelected((prev) => [...prev, passenger]);
    else setSelected((prev) => prev.filter((x) => x.id !== passenger.id));
  };

  const [filter, setFilter] = useState<string>('');

  const sortedPassengers = useMemo(() => {
    return [...passengers].sort(
      (a, b) => selectedPassengers.indexOf(b) - selectedPassengers.indexOf(a),
    );
  }, [passengers]);

  const filteredPassengers = useMemo(() => {
    return sortedPassengers.filter(
      (x) =>
        x.englishFamily?.includes(filter) ||
        x.englishName?.includes(filter) ||
        x.persianName?.includes(filter) ||
        x.persianFamily?.includes(filter),
    );
  }, [filter, sortedPassengers]);

  useEffect(() => {
    setSelected(
      selectedPassengers.filter((selected) =>
        passengers.find((passenger) => passenger.id === selected.id),
      ),
    );
  }, [passengers]);

  return (
    <>
      <div className="d-block d-md-none mt-3">
        <PassengerList
          getPassengers={getPassengers}
          passengers={passengers}
          setPassenger={setPassenger}
          selectedPassengers={selectedPassengers}
        />
      </div>
      <div className="d-none d-md-block">
        {passengers.length > 0 ? (
          <>
            <div className="my-4">
              <div className={styles['passenger-list']}>
                <div className="d-flex p-2 px-3">
                  <UserIcon />
                  <span>انتخاب مسافران</span>
                </div>
                <Divider type="horizontal" />
                <div dir="ltr">
                  {passengers.length === 0 && (
                    <div className="rtl p-3 px-4 pb-2">
                      هیچ مسافری در لیست مسافران وجود ندارد.لطفا اطلاعات مسافران جدید را وارد کنید .
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between px-4 mt-3">
                  <span>
                    لطفا مسافران این سفر را از لیست زیر انتخاب کنید و یا اطلاعات مسافران جدید را
                    اضافه کنید.
                  </span>
                  <div>
                    <PassengersSearchBox
                      placeholder="جستجو مسافران"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                      title="جستجو مسافران"
                    />
                  </div>
                </div>
                <>
                  <div className="mt-3 px-4 mb-3">
                    <table className={cn('w-100')}>
                      <thead className={styles['passenger-list__header']}>
                        <tr>
                          <th></th>
                          <th>نام و نام خانوادگی </th>
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
                        {React.Children.toArray(
                          filteredPassengers?.map((passenger, index) => {
                            return (
                              <PassengerItem
                                passenger={passenger}
                                setPassenger={setPassenger}
                                selectedPassengers={selectedPassengers}
                                getPassengers={getPassengers}
                                key={index.toString() + passenger?.id + 'passengersList'}
                              />
                            );
                          }),
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Divider type="horizontal" />
                  <AddForm getPassengers={getPassengers} />
                </>
              </div>
            </div>
            <Footer selectedPassengers={selectedPassengers} />
          </>
        ) : (
          <>
            <div className="mt-2">
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
        )}
      </div>
    </>
  );
};

export default PassengersList;
