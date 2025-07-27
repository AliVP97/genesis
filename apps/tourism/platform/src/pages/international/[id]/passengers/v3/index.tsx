import { Layout } from 'layout/desktopLayout';
import { MobileLayout } from 'layout/mobileLayout';
import HeaderHoc from 'components/headerHoc';
//import {TimeComparator} from 'utils/helpers/expireTimer';
import { ReactElement, useContext, useEffect, useState } from 'react';
//import {useExpireContext} from 'utils/hooks/useExpireContext';
import dynamic from 'next/dynamic';
import { useExpireContext } from 'utils/hooks/useExpireContext';
import { ServiceDetector } from 'utils/helpers/serviceDetector';
import { TimeComparator } from 'utils/helpers/expireTimer';
import Footer from 'module/internationalFlight/passenger/components/list/footer/footerV3';
// import {useGetInternationalFlightOrder} from 'module/internationalFlight/tickets/hooks/useGetInternationalFlightOrder';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import useSetPassengers from 'module/internationalFlight/passenger/hooks/useSetPassengers';
import { useRouter } from 'next/router';
// import {checkValidity} from 'module/internationalFlight/passenger/utilities/checkPassengerNumbersValidity';
// import {notify} from 'utils/notification';
import { TSetPassengersPayloadV3 } from 'services/internationalFlight/addPassenger/interface';
import * as Sentry from '@sentry/nextjs';
import SelectedInternationalTicket from 'module/internationalFlight/tickets/selectedTicket';
import { useGetInternationalFlightOrder } from 'module/internationalFlight/tickets/hooks/useGetInternationalFlightOrder';
import { AuthContext } from 'context/login';
// import {ServiceDetector} from 'utils/helpers/serviceDetector';
const PassengerList = dynamic(() => import('components/passenger/components/passengersList'), {
  ssr: false,
});

const PassengerPage = () => {
  const { checkExpiry } = useExpireContext();
  const service = ServiceDetector();
  const [selectedPassengers, setSelectedPassengers] = useState<PassengerModel[]>([]);
  const { orderData, isLoading: isOrderDataLoading } = useGetInternationalFlightOrder();
  const { isLoading, setInternationalFlightPassengers } = useSetPassengers();
  const router = useRouter();
  const { id } = router.query;
  const handleClick = () => {
    // try {
    //   checkValidity(orderData, selectedPassengers);
    // } catch (error) {
    //   notify({
    //     message: <span className="text-weight-500 fa">{error as string}</span>,
    //     type: 'warn',
    //     config: {position: 'bottom-center'},
    //   });
    //   return;
    // }
    const selected = selectedPassengers.map((item) => {
      return item?.id;
    }) as string[];
    const payload: TSetPassengersPayloadV3 = {
      orderId: id?.toString(),
      passengerIds: selected,
    };
    setInternationalFlightPassengers(payload);
  };
  const { login } = useContext(AuthContext);
  const { isMobile } = useDeviceDetect();
  useEffect(() => {
    const timeout = setTimeout(
      () => checkExpiry({ type: 'uuid', expired: true }),
      TimeComparator('uuid-expiry', service),
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  const passengerCount = () => {
    try {
      const lastSearch = JSON.parse(
        localStorage.getItem('international_flight_last_search') as string,
      );
      return (
        lastSearch[0]?.passenger?.adult +
        lastSearch[0]?.passenger?.child +
        lastSearch[0]?.passenger?.infant
      );
    } catch (error) {
      Sentry.captureException(error);
    }
  };
  return (
    <>
      <HeaderHoc>
        <span className="text-3 text-weight-500"> مسافران</span>
      </HeaderHoc>
      {orderData && !isMobile && (
        <div className="mt-4">
          {' '}
          <SelectedInternationalTicket orderData={orderData} isLoading={isOrderDataLoading} />
        </div>
      )}

      {login && (
        <PassengerList
          isConfirmButtonLoading={isLoading}
          addPassengers={() => isMobile && handleClick()}
          addSelectedPassengers={setSelectedPassengers}
          isConfirmButton={isMobile ? true : false}
          serviceName="international-flight"
          maxSelectable={passengerCount()}
          refrenceDate={
            orderData?.order?.itinerary?.returningFlight?.destination?.flightDateTime?.dateEn
              ? orderData?.order?.itinerary?.returningFlight?.destination?.flightDateTime?.dateEn?.replaceAll(
                  '/',
                  '-',
                )
              : orderData?.order?.itinerary?.leavingFlight?.destination?.flightDateTime?.dateEn?.replaceAll(
                  '/',
                  '-',
                )
          }
          showSelectedCount
        />
      )}

      {!isMobile && login ? (
        <Footer
          // passengers={passengers}
          handleClick={handleClick}
          isLoading={isLoading}
        />
      ) : null}
    </>
  );
};

PassengerPage.getLayout = function getLayout(page: ReactElement) {
  const { device } = page.props;
  return device == 'desktop' ? (
    <Layout isProtected {...page.props}>
      {page}
    </Layout>
  ) : (
    <MobileLayout isProtected {...page.props}>
      {page}
    </MobileLayout>
  );
};

export default PassengerPage;
