import { FilterType } from 'containers/filter/filterTicket/interface';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { GetDomesticTicketResponse } from 'services/domestic/flight/interface';
import { parseQuery, submitFilter } from 'utils/helpers/filters';
import { Device } from 'utils/interface';
import queryString from 'query-string';
import useDetectBreakPoint from 'utils/hooks/useDetectBreakPoint';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import { definitions } from 'types/domestic-flight-aggregator';
import { scrollHandler } from 'store/slices/domestic-flights/mainPageScrollPlace';
import { useDispatch } from 'react-redux';

export const useHandleFilter = (
  data: GetDomesticTicketResponse,
  device: Device,
  selected: TicketType | null,
) => {
  const dispatch = useDispatch();
  const { query, push } = useRouter();
  const { breakPoint } = useDetectBreakPoint();

  const initialState = parseQuery(query);
  const [tempFilter, setTempFilter] = useState<FilterType>(initialState);

  const minMax = useMemo(() => {
    if (!data?.flightQueryResult) return { min: 0, max: 0 };
    let orderPrice = null;
    if (selected) {
      if (!data.flightQueryResult[1]?.flightList) return { min: 0, max: 0 };
      orderPrice = [...data?.flightQueryResult[1]?.flightList]
        .filter((flight) => flight.remainingSeats !== 0) // Filter out flights with remainingSeats equal to 0
        .sort((a, b) => a.price! - b.price!);
    } else {
      if (!data.flightQueryResult[0].flightList) return { min: 0, max: 0 };
      orderPrice = [...data.flightQueryResult[0].flightList]
        .filter((flight) => flight.remainingSeats !== 0) // Filter out flights with remainingSeats equal to 0
        .sort((a, b) => a.price! - b.price!);
    }

    return {
      min: orderPrice?.[0]?.price || 0,
      max: orderPrice[orderPrice.length - 1]?.price || 0,
    };
  }, [data, selected]);

  const filtersLength = useMemo(() => {
    let counter = 0;
    for (const key in query) {
      if (
        key === 'price' ||
        key === 'toward' ||
        key === 'airlines' ||
        (key === 'stops' && query[key]?.length) ||
        key === 'ticketType' ||
        key === 'flightClass' ||
        key === 'availableFlights'
      )
        counter++;
    }

    return counter;
  }, [query]);

  const updateQuery = useCallback(
    (filters: FilterType) => {
      const newQuery = {
        ...query,
        id: undefined,
        ...filters,
        price:
          filters.price && (filters.price.min > minMax.min || filters.price.max < minMax.max)
            ? [filters?.price.min, filters?.price.max]
            : undefined,
      };
      push(
        {
          pathname: '/flights/' + query?.id,
          query: queryString.stringify({ ...newQuery }, { arrayFormat: 'comma' }),
        },
        undefined,
        { shallow: true },
      ).catch(() => {
        throw new Error('try it again');
      });
    },
    [push],
  );

  const handleUpdate = (value: string, type: keyof FilterType) => {
    dispatch(scrollHandler({ status: true }));
    const filters: FilterType =
      device === Device.desktop && breakPoint != 'Medium'
        ? { ...parseQuery(query) }
        : { ...tempFilter };

    if (type === 'price') {
      const [min, max] = value.split(',').map(Number);
      filters.price = { min, max };
    } else if (type === 'ticketType' || type === 'flightClass') {
      // filters.ticketType always equals ["charter"] or ["system"] or undefined
      if (filters[type]?.includes(value)) {
        filters[type] = undefined;
      } else {
        filters[type] = [value];
      }
    } else if (type === 'availableFlights') {
      if (filters[type] !== undefined) {
        filters[type] = undefined;
      } else {
        filters[type] = [value];
      }
    } else {
      if (filters[type]?.includes(value)) {
        filters[type] = filters[type]?.filter((el) => el !== value);
      } else if (filters[type]) {
        filters[type] = [...filters[type], value];
      } else {
        filters[type] = [value];
      }
    }
    if (device === Device.desktop && breakPoint != 'Medium') {
      updateQuery(filters);
    } else {
      setTempFilter(filters);
    }
  };

  const removeFilter = (value: string, type: keyof FilterType) => {
    const filters: FilterType =
      device === Device.desktop && breakPoint != 'Medium'
        ? { ...parseQuery(query) }
        : { ...tempFilter };
    if (type === 'price') {
      const priceOrder = value.split(',');
      if (!priceOrder[0].length || !priceOrder[1].length) {
        filters.price = undefined;
      }
    } else {
      filters[type] = filters[type]?.filter((el) => el !== value);
    }
    setTempFilter(filters);
    updateQuery(filters);
  };

  const filterHoursOnTheSameDay = () => {
    const flightList = data.flightQueryResult?.[1]?.flightList
      ? data.flightQueryResult?.[1].flightList.filter((item) => {
          if (item?.departure?.date && selected?.arrival?.date) {
            return item.departure.date >= selected.arrival.date || item?.remainingSeats === 0;
          }
          return false;
        })
      : [];
    return { ...data.flightQueryResult?.[1], flightList };
  };

  const filterReturningFlights = () => {
    if (query.departureDate === query.returningDate) {
      return filterHoursOnTheSameDay();
    }
    return data.flightQueryResult?.[1];
  };

  const filteredTickets = useMemo(() => {
    if (!data?.flightQueryResult) return [];
    if (!data.flightQueryResult[0]?.flightList) return [];

    let flightList;
    if (selected && query.returningDate) {
      flightList = data.flightQueryResult[1] ? filterReturningFlights() : [];
    } else {
      flightList = data.flightQueryResult[0] ? data.flightQueryResult[0] : [];
    }

    const result =
      flightList && (flightList as definitions['aggregatorFlightQueryResult']).flightList;

    if (!result?.length) return [];
    return submitFilter(query, result);
  }, [query, data, selected]);

  const suggestionList = useMemo(() => {
    if (!data?.suggestion) return [];
    if (!data.suggestion?.suggests) return [];
    if (data.suggestion.suggests) return data.suggestion.suggests;
  }, [query, data]);

  const fullCapacity =
    data?.finished &&
    filteredTickets.length != 0 &&
    filteredTickets.every((ticket) => ticket.remainingSeats == 0);

  const isUnavailable = data?.finished && filteredTickets.length === 0;

  const showFullCapacityBanner = filtersLength === 0 && (fullCapacity || isUnavailable);

  const suggestionCondition =
    !!data?.suggestion?.suggests && !!data?.suggestion?.suggests[0] && !selected;

  return {
    minMax,
    filtersLength,
    removeFilter,
    handleUpdate,
    updateQuery,
    tempFilter,
    setTempFilter,
    filteredTickets,
    suggestionList,
    data,
    fullCapacity,
    isUnavailable,
    showFullCapacityBanner,
    suggestionCondition,
  };
};
