import { useState } from 'react';
import { resetFilters } from 'utils/helpers/resetFilters';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import { useRouter } from 'next/router';
import moment from 'moment-jalaali';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { domesticFlight } from 'store/slices/ecommerce/ecomerceSlice';
import { GetDomesticTicketResponse } from 'services/domestic/flight/interface';
import { useQuery } from 'react-query';
import { SelectedFlightsData } from 'services/domestic/flight';

type QueryParamsType = {
  departureFlightId: string;
  returningFlightId?: string;
};

export const useSelectTicket = () => {
  const { query, push, pathname } = useRouter();
  useQuery(['departureSelectedFlightData', query?.departureFlightId], SelectedFlightsData, {
    onSuccess: (departureTicketData) => setSelected(departureTicketData || null),
    onError: () => {
      const { departureFlightId, ...restQuery } = query;
      void departureFlightId;
      resetFilters(restQuery, push);
    },
    enabled: !!query?.departureFlightId, // Only run the query if departureFlightId exists
  });
  const dispatch = useDispatch();

  const { setSelectedTicketDeparture, setSelectedTicketReturning } = useSelectedTicket();

  const [selected, setSelected] = useState<TicketType | null>(null);
  const [changedDepartureDateBySuggestion, setChangedDepartureDateBySuggestion] =
    useState<boolean>(false);

  const domesticFlightTracking = new DomesticFlightTrackingEvent();
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );

  const callingEcommerceEvents = (data: GetDomesticTicketResponse[], index: number) => {
    if (domesticFlightData instanceof Object && 'ticketsData' in domesticFlightData) {
      domesticFlightTracking.addToCart({
        ...domesticFlightData,
        itinerary: data,
        index: index,
      } as propsModel);
      dispatch(
        domesticFlight({
          flights: {
            ...domesticFlightData,
            itinerary: data,
            index: index,
          } as propsModel,
        }),
      );
    }
  };

  const handleSelectTicket = (data: TicketType, index?: number) => {
    const q = { ...query };
    if (q?.returningDate && !selected) {
      setSelectedTicketDeparture({ selectedTicketDeparture: data });
      // setSelected(data);
      //when the user chooses another departure date by suggestion tickets the departureDate of q will change to pass q to resetFilters function below
      const newDepartureDate = moment(Number(data?.departure?.date) * 1000).format('jYYYY-jMM-jDD');
      if (q?.departureDate !== newDepartureDate) {
        setChangedDepartureDateBySuggestion(true);
      }
      q.departureDate = newDepartureDate;
      resetFilters(q, push, 'roundTrip');
      callingEcommerceEvents([{ ...data }] as GetDomesticTicketResponse[], index ?? 0);
      push({
        pathname: pathname,
        query: {
          ...query,
          departureFlightId: data?.flightID,
        },
      }).catch(() => {
        throw new Error('try it again');
      });
      return;
    }
    if (q.returningDate && selected && data) {
      setSelectedTicketReturning({ selectedTicketReturning: data });
    } else {
      setSelectedTicketReturning({ selectedTicketReturning: null });
    }

    const ticket = [];
    if (q?.returningDate && selected) {
      ticket.push({ ...selected }, { ...data });
    } else {
      ticket.push({ ...data });
    }
    callingEcommerceEvents(ticket as GetDomesticTicketResponse[], index ?? 0);
    const queryParams: QueryParamsType = {
      departureFlightId: ticket[0].flightID!,
    };
    if (ticket?.[1]?.flightID) {
      queryParams.returningFlightId = ticket[1].flightID;
    }
    push({
      pathname: `/flights/passengers/v3`,
      query: { ...queryParams },
    }).catch(() => {
      throw new Error('try it again');
    });
  };

  return {
    handleSelectTicket,
    selected,
    setSelected,
    changedDepartureDateBySuggestion,
    setChangedDepartureDateBySuggestion,
  };
};
