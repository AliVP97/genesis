import React, { useLayoutEffect, useState } from 'react';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import HeaderHoc from 'components/headerHoc';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import TravelDesktop from './components/desktop';
import TravelMobileContent from './components/mobileContent';
import TravelSearchBox from './components/searchBox';
import TravelTabSelector from './components/tabSelector';
import useTravel from './hooks/useTravel';
import { TravelTabType } from './interface';
const PassengersList = dynamic(
  () => import('components/passenger/components/passengersList/index'),
  {
    ssr: false,
  },
);
import TrainRefund from 'module/train/refund';
const MyTravels = () => {
  const { isMobile } = useDeviceDetect();
  const [activeTab, setActiveTab] = useState<string>(TravelTabType.TRAVELS);
  const { orders, ordersLength, isLoading, filter, setFilter } = useTravel();
  const { query } = useRouter();

  const trainRefundOrderId = query.slug?.[0] === 'train' && query.slug?.[1];

  useLayoutEffect(() => {
    if (query.hasOwnProperty('passenger')) {
      setActiveTab(TravelTabType.PASSENGERS);
    }
  }, []);

  function renderMobileContent() {
    if (activeTab === TravelTabType.TRAVELS) {
      return (
        <>
          <TravelSearchBox filter={filter} setFilter={setFilter} />
          <TravelMobileContent
            ordersLength={ordersLength}
            orders={orders}
            filter={filter}
            isLoading={isLoading}
          />
        </>
      );
    }

    return <PassengersList serviceName="passenger" />;
  }

  function renderDesktopContent() {
    return (
      <TravelDesktop filter={filter} setFilter={setFilter} orders={orders} isLoading={isLoading} />
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="pt-5">
          <HeaderHoc>
            <div className="text-center text-3 justify-content-center row text-weight-500 pb-2">
              مدیریت سفرها
            </div>
            <TravelTabSelector
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={TravelTabType}
            />
          </HeaderHoc>
          {renderMobileContent()}
        </div>
      ) : (
        renderDesktopContent()
      )}
      {trainRefundOrderId && <TrainRefund />}
    </>
  );
};
export default MyTravels;
