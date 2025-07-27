import React from 'react';
import { TourGallery } from './components/gallery';
import HeaderHoc from 'components/headerHoc';
import { useDetails } from './hooks/usedetails';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import FixedBtn from './components/fixedBtn';
import {
  TRequirementDocuments,
  TTourCalendar,
  TTourItinerary,
  TTourPDPAccommodation,
  TTourPDPCancellationPolicy,
  TTourServices,
} from 'services/tour/v2/detail/types';
import SelectDate from './components/selectDate';
import Services from './components/services';
import Consulting from './components/consulting';
import Itinerary from './components/itinerary';
import TourDocument from './components/document';
import TourPolicies from './components/policies';
import cn from 'classnames';
import styles from './style.module.scss';
import Button from '../../../components/button';
import Accommodation from './components/accommodation';
import router, { useRouter } from 'next/router';
import Skeleton from 'components/skeleton';
const TourDetails = () => {
  const {
    tourDetail,
    handleUpdateCalenderState,
    handleSubmitDate,
    localCalenderState,
    isLoading,
    isOpenBottomSheet,
    handleIsOpenBottomSheet,
    tabBarItem,
    servicesRef,
    policiesRef,
    itineraryRef,
    accommodationRef,
    documentRef,
    handleTabClick,
  } = useDetails();

  const { isMobile } = useDeviceDetect();
  const { query } = useRouter();

  const calenderData = tourDetail?.calendar?.dates?.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  const handleGoToCheckOut = (packageDateId: string) => {
    return router.push(
      `/tour/checkout/${packageDateId}${query?.requestId ? `?requestId=${query?.requestId}` : ''}`,
    );
  };
  const renderMobileView = () => (
    <>
      <FixedBtn
        packageDateId={tourDetail?.calendar?.defaultDate?.id as string}
        handleGoToCheckOut={handleGoToCheckOut}
        isOneDay={!tourDetail?.accommodation}
        handleIsOpenBottomSheet={handleIsOpenBottomSheet}
        isOpenBottomSheet={isOpenBottomSheet}
        isLoading={isLoading}
        localCalenderState={localCalenderState as string}
        defaultDate={tourDetail?.calendar?.defaultDate?.id as string}
        handleSubmitDate={handleSubmitDate}
        handleUpdateCalenderState={handleUpdateCalenderState}
        calender={tourDetail?.calendar as TTourCalendar}
        basePrice={tourDetail?.calendar?.basePrice as string}
        title={tourDetail?.calendar?.defaultDate?.title as string}
      />

      <Services
        isLoading={isLoading}
        serviceData={tourDetail?.services as TTourServices}
        ref={servicesRef}
      />
      <Itinerary
        isLoading={isLoading}
        itineraryData={tourDetail?.itinerary as TTourItinerary}
        isMobile={isMobile}
        ref={itineraryRef}
      />
      <TourDocument
        isLoading={isLoading}
        ref={documentRef}
        documentData={tourDetail?.requirementDocuments as TRequirementDocuments}
        isMobile={isMobile}
      />
      <TourPolicies
        isLoading={isLoading}
        ref={policiesRef}
        isMobile={isMobile}
        policiesData={tourDetail?.cancellationPolicy as TTourPDPCancellationPolicy}
      />

      {tourDetail?.accommodation?.type && (
        <div ref={accommodationRef} className="card mt-3 p-2">
          <div dir="rtl" className="text-weight-700 pt-3 px-2 pb-2">
            انتخاب اقامتگاه
          </div>
          <Accommodation
            isMobile={isMobile}
            accommodationData={tourDetail?.accommodation as TTourPDPAccommodation}
          />
        </div>
      )}

      <Consulting />
    </>
  );

  const renderDesktopView = () => (
    <div dir="rtl" className="row py-4">
      <div className="col-9">
        <div dir="rtl" className={cn(styles['fixed-tab'], ' mb-3 d-flex flex-row pt-3 ')}>
          {tabBarItem.map((tab, index) => {
            return (
              <div
                onClick={() => handleTabClick(tab.id)}
                key={index.toString() + 'tourDetail' + tab.id.toString()}
                className={cn(
                  styles['fixed-tab__item'],
                  tab.isSelected ? 'color-primary' : '',
                  tab.isSelected && styles['fixed-tab__border'],
                  'cursor-pointer',
                )}
              >
                <div className="d-flex justify-content-center align-items-center w-100">
                  {isLoading ? (
                    <Skeleton
                      type="tourPdpTabBarItem"
                      rtl
                      uniqueKey="sort"
                      height="50"
                      width="100%"
                    />
                  ) : (
                    tab.name
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Accommodation
          isLoading={isLoading}
          isMobile={isMobile}
          accommodationData={tourDetail?.accommodation as TTourPDPAccommodation}
          ref={accommodationRef}
        />
        <Services
          isLoading={isLoading}
          serviceData={tourDetail?.services as TTourServices}
          ref={servicesRef}
        />
        <Itinerary
          isLoading={isLoading}
          itineraryData={tourDetail?.itinerary as TTourItinerary}
          isMobile={isMobile}
          ref={itineraryRef}
        />
        <TourDocument
          isLoading={isLoading}
          documentData={tourDetail?.requirementDocuments as TRequirementDocuments}
          isMobile={isMobile}
          ref={documentRef}
        />
        <TourPolicies
          isLoading={isLoading}
          ref={policiesRef}
          isMobile={isMobile}
          policiesData={tourDetail?.cancellationPolicy as TTourPDPCancellationPolicy}
        />
      </div>
      <div className="col-3">
        <div className="card d-flex flex-column p-3">
          <div className="text-weight-500 fs-3">تاریخ تور مورد نظر خود را انتخاب کنید.</div>
          <div className="pt-3">
            <SelectDate
              localCalenderState={localCalenderState ?? ''}
              defaultDate={tourDetail?.calendar?.defaultDate?.id ?? ''}
              handleUpdateCalenderState={handleUpdateCalenderState}
              calenderData={calenderData}
            />
          </div>
          <div className="pt-3 d-flex flex-row justify-content-between align-items-center">
            <div className="text-weight-700 fs-3">شروع قیمت از</div>
            <div className="d-flex flex-row justify-content-center align-items-center">
              <div className="color-on-background fs-4 text-weight-500">
                {tourDetail?.calendar?.basePrice &&
                  Number(tourDetail?.calendar?.basePrice).toLocaleString()}
              </div>
              <div className="pe-1 color-surface-fixed fs-3 text-weight-400">ریال</div>
            </div>
          </div>
          {tourDetail?.id && !tourDetail?.accommodation && (
            <Button
              onClick={() =>
                handleGoToCheckOut(
                  query?.dateId
                    ? (query?.dateId as string)
                    : (tourDetail?.calendar?.defaultDate?.id as string),
                )
              }
              className="mt-3 btn btn-primary"
            >
              ثبت درخواست
            </Button>
          )}
        </div>
        <Consulting />
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: '200px' }}>
      <HeaderHoc>
        <span>{tourDetail?.title}</span>
      </HeaderHoc>
      {isLoading ? (
        <Skeleton
          type="tourPdpGallery"
          rtl
          uniqueKey="sort"
          className="bg-color-white rounded pb-2 "
          height={isMobile ? '176' : '530'}
          width="100%"
        />
      ) : (
        <TourGallery
          image={tourDetail?.images as Array<string>}
          title={tourDetail?.title as string}
          content={tourDetail?.content as string}
        />
      )}

      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default TourDetails;
