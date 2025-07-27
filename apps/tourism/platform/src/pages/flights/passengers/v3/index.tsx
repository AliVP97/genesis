import { ReactElement, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useQuery } from 'react-query';

import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
import { TimeComparator } from 'utils/helpers/expireTimer';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import LoginContainer from 'containers/login';
import { TicketType } from 'module/flights/tickets/interface';
import useFlightCreateOrder from 'module/flights/search/hooks/useFlightCreateOrder';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import { domesticFlightTicketPassengerValidateV3 } from 'utils/helpers/validations';
import { notify } from 'utils/notification';
import UseCheckout from 'module/flights/passengers/hooks/useCheckout';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';
import { useSelectedTicket } from 'utils/hooks/useSelectedTicket';
import SelectedTicketItem from 'module/flights/tickets/ticket/SelectedTicketItem';
import { DomesticFlightTrackingEvent } from 'utils/ecommerce/application/mappers/domestic-flight/events';
import { RootState } from 'store';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { resetFilters } from 'utils/helpers/resetFilters';
import { SelectedFlightsData } from 'services/domestic/flight';
import Loader from 'module/internationalFlight/tickets/Loader/Loader';
const PassengersList = dynamic(() => import('components/passenger/components/passengersList'), {
  ssr: false,
});

type FlightsID = {
  departureFlightId: string;
  returningFlightId?: string;
};

let tickets: TicketType[] = [];
let CALL_RETURNING_QUERY = false;

const PassengerPage = ({ content }: { content: FlightsID }) => {
  const { login, setLoginModalVisible } = useAuthContext();
  const { push } = useRouter();

  // @ts-ignore
  const { domesticFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );

  const { selectedTicketDeparture, selectedTicketReturning, setSelectedTicketDeparture } =
    useSelectedTicket();
  const domesticFlightTracking = new DomesticFlightTrackingEvent();

  const handleChangeTowardTicket = (changeTicket: string) => {
    if (domesticFlightData !== undefined) {
      const removeData = [selectedTicketDeparture];
      if (changeTicket === 'returningChange') removeData.push(selectedTicketReturning);
      const flightData = {
        ...domesticFlightData,
        itinerary: removeData,
      };
      domesticFlightTracking.removeFromCart(flightData as propsModel);
    }
    const query = localStorage.getItem('search-query');
    if (query) {
      const parsedQuery = JSON.parse(query);

      if (changeTicket === 'departureChange') {
        if (parsedQuery.departureFlightId) {
          delete parsedQuery.departureFlightId;
        }
        setSelectedTicketDeparture({ selectedTicketDeparture: null });
      }

      resetFilters(parsedQuery, push);
    } else {
      void push('/');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!login) {
        setLoginModalVisible(true);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [login]);

  const { data: departureSelectedFlightData, isLoading: isLoadingDeparture } = useQuery(
    ['departureSelectedFlightData', content.departureFlightId],
    SelectedFlightsData,
    {
      onSuccess: (data: TicketType) => {
        tickets = [];
        CALL_RETURNING_QUERY = true;
        tickets.push(data);
      },
      onError: () => handleChangeTowardTicket('departureChange'),
    },
  );
  const { data: returningSelectedFlightData, isLoading: isLoadingReturning } = useQuery(
    ['returningSelectedFlightData', content.returningFlightId],
    SelectedFlightsData,
    {
      onSuccess: (data: TicketType) => {
        CALL_RETURNING_QUERY = false;
        tickets.push(data);
      },
      onError: () => departureSelectedFlightData && handleChangeTowardTicket('returningChange'),
      enabled: !!content.returningFlightId && CALL_RETURNING_QUERY,
    },
  );

  const { checkExpiry } = useExpireContext();
  const service = ServiceDetector();

  // const [selectedPassengers, setSelectedPassengers] = useState<
  //   PassengerModel[]
  // >([]);
  const selectedPassengers = useRef<PassengerModel[]>([]);
  const {
    createOrderMutate,
    isSuccess,
    createOrderData,
    isLoading: createOrderLoading,
  } = useFlightCreateOrder();
  const createOrder = () => {
    createOrderMutate({
      flightIds: (tickets as TicketType[]).map((ticket) => ticket.flightID || ''),
      flightSource: (tickets as TicketType[]).map(
        (ticket) => ticket?.flightSource || 'FLIGHT_SOURCE_UNDEFINED',
      ),
    });
  };
  const { mutateGetCheckout, isLoading: checkoutLoading } = UseCheckout();
  const addPassenger = (passengers: PassengerModel[]) => {
    selectedPassengers.current = passengers;
    createOrder();
  };
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('reserve_expiry', JSON.stringify(createOrderData?.expireDate));
      localStorage.setItem('order_id', createOrderData?.orderId || '');
    }
  }, [isSuccess]);
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    if (routeChangeCompleted && searchButtonClicked) {
      setSearchButtonClicked(false);
    }
  }, [routeChangeCompleted]);

  useEffect(() => {
    if (domesticFlightData !== undefined) {
      domesticFlightTracking.beginCheckout(domesticFlightData as propsModel);
    }
  }, []);

  const handleClick = async () => {
    try {
      domesticFlightTicketPassengerValidateV3(selectedPassengers?.current, tickets as TicketType[]);

      if (createOrderData?.orderId) {
        mutateGetCheckout({
          orderId: createOrderData?.orderId,
          passengerIds: selectedPassengers?.current.map((el) => el.id) as string[],
        });
      }
    } catch (error) {
      notify({
        message: <span className="text-weight-500 fa">{(error as Error)?.message}</span>,
        type: 'warning',
        config: { position: 'bottom-center' },
      });
      return;
    } finally {
      setSearchButtonClicked(false);
    }
  };
  useEffect(() => {
    if (createOrderData) {
      void handleClick();
    }
  }, [createOrderData]);
  useEffect(() => {
    const timeout = setTimeout(
      () => checkExpiry({ type: 'uuid', expired: true }),
      TimeComparator('uuid-expiry', service),
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  {
    return login ? (
      <>
        <HeaderHoc>
          <span className="text-3 text-weight-500"> مسافران </span>
        </HeaderHoc>
        <div className="d-none d-md-block">
          {isLoadingDeparture && <Loader className="d-block m-auto my-5" />}
          {departureSelectedFlightData && !isLoadingDeparture && (
            <SelectedTicketItem
              ticket={departureSelectedFlightData}
              onChangeTowardTicket={() => handleChangeTowardTicket('departureChange')}
            />
          )}
          {isLoadingReturning && <Loader className="d-block m-auto my-5" />}
          {returningSelectedFlightData && !isLoadingReturning && (
            <SelectedTicketItem
              ticket={returningSelectedFlightData}
              onChangeTowardTicket={() => handleChangeTowardTicket('returningChange')}
              isReturn={true}
            />
          )}
        </div>
        <PassengersList
          serviceName="domestic-flight"
          isConfirmButton={true}
          isConfirmButtonLoading={createOrderLoading || checkoutLoading}
          addPassengers={addPassenger}
          maxSelectable={
            Array.isArray(tickets) && tickets[0]?.remainingSeats
              ? Math.min(tickets[0].remainingSeats, 9)
              : undefined
          }
        />
      </>
    ) : (
      <LoginContainer />
    );
  }
};

PassengerPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout {...page.props}>{page}</Layout>
  ) : (
    <MobileLayout {...page.props}>{page}</MobileLayout>
  );
};

export default PassengerPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { departureFlightId, returningFlightId = null } = context.query;
  if (!departureFlightId) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      content: { departureFlightId, returningFlightId },
    },
  };
};
