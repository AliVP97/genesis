import { UserIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import React, { ChangeEvent, useMemo, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';
import AddForm from './addForm';
import styles from './list.module.scss';
import PassengersSearchBox from './mobileView/serachBox';
import PassengerItem from './passengerItem';
import PassengerList from './mobileView';
import EmptyResult from '../../../../../../components/emptyResult';

type TPassengersListProps = {
  passengers: Array<TPassengerV2>;
  getPassengers: () => void;
  isLoading: boolean;
};

const PassengersTable = ({ passengers, getPassengers }: TPassengersListProps) => {
  const [filter, setFilter] = useState<string>('');

  const filteredPassengers = useMemo(
    () =>
      passengers.filter((x) => {
        return [x?.englishFamily, x?.englishName, x?.persianName, x?.persianFamily].some((item) =>
          item?.includes(filter),
        );
      }),
    [filter, passengers],
  );

  return (
    <>
      <div className="d-block d-md-none mt-3">
        <PassengerList getPassengers={getPassengers} passengers={passengers} />
      </div>
      <div className="d-none d-md-block">
        <div className="px-4 mb-5">
          <div className={styles['passenger-list']}>
            <div className="d-flex p-2 px-3">
              <UserIcon />
              <span>لیست مسافران</span>
            </div>
            <Divider type="horizontal" />
            <div dir="ltr">
              {passengers.length === 0 && (
                <EmptyResult className="mt-3 text-center" hideButton={true} />
              )}
            </div>
            {passengers.length > 0 && (
              <div className="d-flex justify-content-between px-4 mt-3">
                <div>
                  <PassengersSearchBox
                    placeholder="جستجو مسافران"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                    title="جستجو مسافران"
                  />
                </div>
              </div>
            )}

            <div className="mt-3 px-4 mb-3">
              {passengers.length > 0 ? (
                <>
                  <table className={cn('w-100')}>
                    <thead className={styles['passenger-list__header']}>
                      <tr>
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
                        filteredPassengers?.map((passenger) => {
                          return (
                            <PassengerItem passenger={passenger} getPassengers={getPassengers} />
                          );
                        }),
                      )}
                    </tbody>
                  </table>
                  <Divider type="horizontal" />
                </>
              ) : null}
            </div>
            <AddForm getPassengers={getPassengers} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengersTable;
