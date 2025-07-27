import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getOrders } from 'services/domestic/orders';
import { TTrips } from 'services/domestic/orders/interface';
import {
  filterOrdersByDate,
  filterOrdersByOriginDestination,
  generateGetTripFilter,
  sortOrders,
} from '../helper/travelHelper';
import { travelFilter, travelFilterOptions, useTravelReturn } from '../interface';

const useTravel = (): useTravelReturn => {
  const [filterdOrders, setFilterdOrders] = useState<TTrips>([]);
  const [filter, setFilter] = useState<travelFilter>({
    date: { from: null, to: null },
    search: '',
    orderType: travelFilterOptions[0],
  });

  const { data, isSuccess, isLoading } = useQuery(
    ['getOrders', generateGetTripFilter(filter.orderType.value)],
    getOrders,
    {},
  );

  useMemo(() => {
    if (!isSuccess || !data?.tripList) return setFilterdOrders([]);
    let orders: TTrips = data?.tripList;
    orders = sortOrders(orders);
    if (filter.date.from && filter.date.to) orders = filterOrdersByDate(orders, filter.date);
    orders = filterOrdersByOriginDestination(orders, filter.search);

    setFilterdOrders(orders);
  }, [data, isSuccess, filter]);

  return {
    orders: filterdOrders,
    isLoading,
    filter: filter,
    setFilter: setFilter,
    ordersLength: filterdOrders?.length,
  };
};

export default useTravel;
