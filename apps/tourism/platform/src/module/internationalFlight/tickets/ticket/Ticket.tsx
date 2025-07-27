import React, { Dispatch, FC } from 'react';
import styles from './Ticket.module.scss';
import cn from 'classnames';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import {
  TInternationalTicketDetailResponse,
  TTicketDetailPayload,
} from 'services/internationalFlight/detail/interface';
import { UseMutateFunction } from 'react-query';
import TicketSummary from './TicketSummary';
import TicketContent from './TicketContent';
import { TicketProvider, useTicket } from './TicketContext';
import { FlightDictionary } from './types/FlightDictionary';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Itinerary from './types/Itinerary';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { viewItemListModelV2 } from 'utils/ecommerce/application/mappers/international-flight/types';
import { useAppDispatch } from 'store/hook/storeHook';
import { flightDetailsItineraryIndexChanged } from 'store/slices/internationalFlight/flightDetails';

export interface TicketProps {
  curveEdges?: boolean;
  itinerary?: Itinerary;
  disable?: boolean;
  showDetails: boolean;
  isMobile?: boolean;
  dictionary: TDictionary;
  expandAccordion?: () => void;
  requestId: string;
  selectedTicket?: boolean;
  handleClick: UseMutateFunction<TInternationalTicketDetailResponse, unknown, TTicketDetailPayload>;
  isLoading: boolean;
  summaryTitle?: string;
  setShowDetails: Dispatch<string>;
  index?: number;
}

const Component: FC<Omit<TicketProps, 'dictionary' | 'showDetails' | 'summaryTitle'>> = ({
  disable,
  requestId,
  handleClick,
  index,
}) => {
  const { isMobile } = useDeviceDetect();
  const { itinerary } = useTicket();
  const { internationalFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const dispatch = useAppDispatch();

  const handleOpenDetail = () => {
    if (internationalFlightData instanceof Object && 'ticketsData' in internationalFlightData) {
      const CartObject: viewItemListModelV2 = {
        ...(internationalFlightData as viewItemListModelV2),
        itinerary: itinerary,
      };
      const internationalFlightTracking = new FlightInternationalTracking();
      internationalFlightTracking.selectItem(CartObject, index);
    }
    dispatch(flightDetailsItineraryIndexChanged(index ?? 0));
    handleClick({ requestId, itineraryId: String(itinerary?.itineraryId) });
  };

  return (
    <div
      dir={'rtl'}
      className={cn(
        'mb-3 d-flex flex-column flex-lg-row',
        styles['root'],
        disable && styles['ticket--disable'],
      )}
      onClick={isMobile ? handleOpenDetail : undefined}
    >
      <TicketContent />
      <TicketSummary handleShowDetails={handleOpenDetail} />
    </div>
  );
};

export default function Ticket(props: TicketProps) {
  const {
    summaryTitle,
    itinerary,
    dictionary: propsDictionary,
    showDetails,
    curveEdges = true,
    ...rest
  } = props;

  const dictionary: FlightDictionary = {
    airline: propsDictionary.airlineDictionary,
    airCraft: propsDictionary.aircraftDictionary,
    iata: propsDictionary.iataDictionary,
  };

  if (!itinerary) {
    return null;
  }

  return (
    <TicketProvider value={{ itinerary, dictionary, showDetails, curveEdges, summaryTitle }}>
      <Component {...rest} />
    </TicketProvider>
  );
}
