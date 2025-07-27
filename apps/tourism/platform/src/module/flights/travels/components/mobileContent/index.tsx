import cn from 'classnames';
import styles from '../../travels.module.scss';

import TravelSkeleton from '../skeleton';
import { NUMBER_OF_SKELETON_IN_TRAVEL_LOADING, travelFilter } from '../../interface';
import TravelNotFoundTicketBySearch from '../notFountTicketBySearch';

import TravelTicketListEmptyWarning from '../ticketListEmptyWarning';
import TravelTicket from '../ticket';
import TicketSearchNoResult from '../ticketSearchNoResult';
import { TTrips } from 'services/domestic/orders/interface';
import React from 'react';

type TravelMobileContentProps = {
  orders: TTrips;
  filter: travelFilter;
  ordersLength: number;
  isLoading: boolean;
};

const TravelMobileContent = ({
  orders,
  filter,
  ordersLength,
  isLoading,
}: TravelMobileContentProps) => {
  let content;

  if (isLoading) {
    content = <TravelSkeleton numberOfSkeletons={NUMBER_OF_SKELETON_IN_TRAVEL_LOADING} />;
  } else if (!isLoading && ordersLength) {
    if (!orders.length && filter.search) {
      content = <TravelNotFoundTicketBySearch />;
    } else {
      content = React.Children.toArray(
        orders?.map((order, index) => (
          <TravelTicket key={index.toString() + order?.orderNumber} order={order} />
        )),
      );
    }
  } else if (ordersLength === 0 && filter.search) {
    content = <TicketSearchNoResult />;
  } else {
    content =
      !orders?.length && !filter.search ? (
        <TravelTicketListEmptyWarning
          title={`شما تابحال ${filter?.orderType?.value === 'Hotel' ? 'رزرو' : 'سفر'} نداشته‌اید`}
        />
      ) : null;
  }

  return (
    <div className={cn(styles['travels'], 'd-flex flex-column justify-content-between')} dir="rtl">
      {content}
    </div>
  );
};

export default TravelMobileContent;
