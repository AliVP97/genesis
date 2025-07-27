import React, { useEffect, useRef } from 'react';
import { DomesticFlightIcon, BusIcon, TrainIcon } from 'assets/icons';
import classNames from 'classnames';
import Button from 'components/button';
import styles from './desktopTourCardList.module.scss';
import Slider from 'components/slider';
import { definitions } from 'types/tour';
import Skeleton from 'components/skeleton';
import skeletonStyles from 'components/skeleton/skeleton.module.scss';
import { useRouter } from 'next/router';
import WEB from 'utils/routes/web';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { TourTrackingEvent } from 'utils/ecommerce/application/mappers/tour/events';

type TourFiltersProps = {
  callNewItems: boolean;
  setPageNumber: () => void;
  cardData: definitions['tourSearchResponseData'][];
  isLoading: boolean;
  requestId: string;
};

const DesktopTourCardList = ({
  callNewItems,
  setPageNumber,
  cardData,
  isLoading,
  requestId,
}: TourFiltersProps) => {
  const { isMobile } = useDeviceDetect();
  const { push, query } = useRouter();
  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!callNewItems) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber();
        }
      },
      { threshold: 0.1 }, // Trigger when the element is 10% visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [callNewItems, setPageNumber]);

  const iconType = (type: string) => {
    switch (type) {
      case 'FLIGHT': {
        return <DomesticFlightIcon />;
      }
      case 'TRAIN': {
        return <TrainIcon />;
      }
      case 'BUS': {
        return <BusIcon />;
      }
      default: {
        break;
      }
    }
  };

  const goToDetailsPage = (tripId: string, clickOnCard = false) => {
    if (isMobile === false && clickOnCard) return;
    push({
      pathname: `${WEB.TOUR + '/detail/' + tripId}`,
      query: {
        requestId: requestId,
      },
    }).catch(() => new Error());
  };

  const displayFacilities = (data: definitions['tourSearchResponseData']) => (
    <div className=" d-flex flex-row me-1 align-items-center pt-3 mt-auto flex-wrap flex-md-nowrap">
      <div className="color-grey-19 text-2 mb-2 mb-md-0">امکانات تور :</div>
      {data?.facilities?.slice(0, 5)?.map((service, key) => {
        return (
          <div
            key={key}
            className={' mx-2 py-1 px-2 bg-color-grey-20 rounded-4 text-2 mb-2 mb-md-0'}
          >
            {service}
          </div>
        );
      })}
      {data?.facilities && data?.facilities?.length > 5 && (
        <div className="mx-2 py-1 px-2 bg-color-grey-20 rounded-4">...</div>
      )}
    </div>
  );

  return (
    <div>
      {cardData &&
        cardData.map((data, index) => {
          return (
            <div
              className="d-flex card flex-column justify-content-between flex-md-row w-100 rounded-5 bg-color-on-primary-surface   my-3"
              key={'card-data' + index}
              onClick={() => goToDetailsPage(data?.id || '', true)}
            >
              <div className="d-flex w-100 ">
                {data?.images && (
                  <div className="w-25">
                    <Slider startPos="ltr" images={data?.images} title={''} dots={false} />
                  </div>
                )}
                <div className="p-3">
                  <div className="d-flex flex-column h-100">
                    <div className="text-weight-700">{data.title}</div>
                    <div className="d-flex flex-row text-weight-400 text-2 pt-3 align-items-center">
                      {data.transport?.type && iconType(data.transport.type)}
                      <div className="pe-2">{data.transport?.title}</div>
                    </div>
                    {data?.facilities &&
                      data.facilities.length > 0 &&
                      !isMobile &&
                      displayFacilities(data)}
                  </div>
                </div>
              </div>
              {data?.facilities &&
                data.facilities.length > 0 &&
                isMobile &&
                displayFacilities(data)}
              <div
                className={classNames(
                  styles.card__dashed,
                  ' d-flex flex-row align-items-center justify-content-between w-100 w-md-25 flex-md-column justify-content-md-center',
                )}
              >
                <div className="  pb-md-2 text-2 text-weight-500 me-2 me-md-0">
                  قیمت تور برای ۱ بزرگسال
                </div>
                <div className=" d-flex align-items-center text-5 py-2 ">
                  <div className="text-weight-500 text-4 text-6-md">
                    {Number(data?.basePrice)?.toLocaleString()}
                  </div>
                  <span className="text-2 color-grey-1 pe-1 ms-2 ms-md-0">ریال</span>
                </div>
                <Button className="btn btn-primary button--radius px-4 d-none d-md-block" radius>
                  <div
                    className="px-3 text-3"
                    onClick={() => {
                      const { originName, destinationName } = query;

                      const tourEvents = new TourTrackingEvent();
                      tourEvents.selectItem(
                        data as definitions['tourSearchResponseData'],
                        originName as string,
                        destinationName as string,
                      );

                      goToDetailsPage(data?.id || '');
                    }}
                  >
                    مشاهده جزئیات
                  </div>
                </Button>
              </div>
            </div>
          );
        })}
      {isLoading &&
        [...Array(4)].map((_, index) => (
          <Skeleton
            type="tourTickets"
            key={`tourSearch-${index}`}
            rtl
            uniqueKey="tour"
            className={skeletonStyles.skeleton__tour}
          />
        ))}
      <div ref={observerRef} className="observer" style={{ height: 10 }} />
    </div>
  );
};

export default DesktopTourCardList;
