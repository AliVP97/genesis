import cn from 'classnames';
import styles from '../../travels.module.scss';
import React from 'react';

import { travelFilter, travelFilterOptions } from '../../interface';
import HorizontalFilterBox from 'components/horizontalFilterBox';
import TripsReportHeader from './header';
import TripsDesktopSearchBox from './searchBox';
import TripsTableLoading from './tableLoading';
import TripsTableHeader from './tableHeader';
import TripsTableBody from './tableBody';
import { TTrips } from 'services/domestic/orders/interface';
import TravelTicketListEmptyWarning from '../ticketListEmptyWarning';
import TicketSearchNoResult from '../ticketSearchNoResult';
import TripType from './tableHeader/types/TripType';

interface TravelProps {
  orders?: TTrips;
  isLoading?: boolean;
  filter: travelFilter;
  setFilter: React.Dispatch<React.SetStateAction<travelFilter>>;
}

const TravelDesktop = ({ orders, isLoading, filter, setFilter }: TravelProps) => {
  const tripType = filter.orderType.value as TripType;

  const tableContent = isLoading ? <TripsTableLoading /> : <TripsTableBody orders={orders} />;

  const noResultsContent = filter.search ? (
    <TicketSearchNoResult />
  ) : (
    <TravelTicketListEmptyWarning
      title={`شما تابحال ${filter?.orderType?.value === 'Hotel' ? 'رزرو' : 'سفری'} نداشته‌اید`}
    />
  );

  return (
    <>
      {
        <>
          <div className="container rtl mb-lg-5">
            <div className="mb-3 ltr">
              <HorizontalFilterBox
                title="فیلتر بر اساس نوع سفارش"
                options={travelFilterOptions}
                selectedItem={filter.orderType}
                setSelectedItem={(value) => setFilter((prev) => ({ ...prev, orderType: value }))}
              />
            </div>
            <div
              className={cn(
                styles['travels-container'],
                'w-100 d-flex flex-column bg-color-surface-saj mb-3',
              )}
            >
              <TripsReportHeader />
              <div
                className={cn(styles['travels-container__content'], 'd-flex flex-column p-4 px-5')}
              >
                <TripsDesktopSearchBox
                  value={filter.search}
                  setValue={(value) => setFilter((prev) => ({ ...prev, search: value }))}
                />
                {orders?.length || isLoading ? (
                  <table
                    className={cn(
                      styles['travels-container__content__items'],
                      'bg-color-surface-container-low',
                    )}
                  >
                    <thead>
                      <TripsTableHeader tripType={tripType} />
                    </thead>
                    {tableContent}
                  </table>
                ) : (
                  noResultsContent
                )}
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default TravelDesktop;
