import cn from 'classnames';
import styles from 'module/internationalFlight/tickets/component/intelFlightDetail/ticketDetail.module.scss';
import { TDictionary } from 'services/internationalFlight/flight/interface';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import { useCreateDetailData } from 'module/internationalFlight/tickets/hooks/useCreateDetailData';
import { customLoader } from 'utils/helpers/imageLoader';
import {
  initialDetailData,
  initialDetailSegments,
  PersianPassengerType,
  TripMode,
} from 'module/internationalFlight/tickets/interface';
import Image from 'next/image';
import { ChildIcon, LuggageIcon, StopOver, InfoIcon } from 'assets/icons';
import TechnicalStop from './TechnicalStop';
import { Fragment } from 'react';

interface Props {
  ticket: TIntelTicket;
  isDesktop?: boolean;
  dictionary: TDictionary;
  isLoading: boolean;
}

const IntelFlightDetail = ({ ticket, isDesktop, dictionary, isLoading }: Props) => {
  const initDetailData = useCreateDetailData(ticket, dictionary, isLoading);
  return (
    <>
      {!isLoading &&
        (initDetailData as unknown as initialDetailData[])?.map((item, index) => {
          return (
            <Fragment key={index}>
              <div
                className={cn(styles['ticket-detail__content'], !isDesktop ? 'container' : 'pb-2')}
                style={
                  (initDetailData as unknown as initialDetailData[])?.length - 1 === index
                    ? { paddingBottom: '150px' }
                    : {}
                }
              >
                <div
                  className={cn(
                    styles['ticket-detail__content__head'],
                    ' px-3  color-primary d-flex flex-column mt-3 flex-lg-row  justify-content-lg-between align-items-lg-center',
                    !isDesktop && 'justify-content-center',
                  )}
                  style={!isDesktop ? { height: '62px' } : {}}
                >
                  <div className="d-flex flex-row ">
                    <span className="ps-1 pb-2 p-lg-0 align-self-center text-3">
                      {ticket?.tripMode &&
                      TripMode[
                        ticket?.tripMode.toString() as
                          | 'TRIP_MODE_ROUND_TRIP'
                          | 'TRIP_MODE_UNDEFINED'
                          | 'TRIP_MODE_ONEWAY'
                      ] === 1
                        ? 'پرواز'
                        : index
                          ? 'پرواز برگشت'
                          : 'پرواز رفت'}
                    </span>
                    <span className="me-2">{`${item.originCity} - ${item.destinationCity}`}</span>
                  </div>
                  <div className="d-flex flex-row text-2">
                    <span className="ps-2">مدت سفر:</span>
                    {item.durationHours} ساعت
                    {item.durationMinutes ? ` و ${item.durationMinutes} دقیقه ` : null}
                  </div>
                </div>
                {(item.segments as initialDetailSegments[])?.map((segment, index) => {
                  return (
                    <Fragment key={index}>
                      <div className={cn(isDesktop && 'bg-color-white-1 rounded', 'p-3')}>
                        <div className="d-flex flex-row">
                          <div className="ps-1 ">
                            <div
                              className={cn(styles['ticket-detail__content__logo'], 'd-fle d-flex')}
                            >
                              <Image
                                className={'rounded-circle'}
                                loader={customLoader}
                                src={`${segment.logo}`}
                                alt="airline logo"
                                width={'32px'}
                                height={'32px'}
                                quality={100}
                                unoptimized
                                objectFit="scale-down"
                              />
                            </div>
                          </div>

                          <div className="d-flex flex-column col p-0 me-3 align-content-start">
                            <div className="d-flex d-flex flex-column text-2">
                              {isDesktop && (
                                <div className="d-flex text-4 mb-3">
                                  <span>{segment?.airline}</span>
                                  <span className="en mx-2">{segment?.airplaneCode}</span>
                                </div>
                              )}
                              <div className="mb-2 d-flex">
                                {isDesktop && (
                                  <>
                                    <div className="d-flex  color-grey-1 text-3">
                                      شماره پرواز:
                                      <span className="color-black en text-3 pe-2">
                                        {segment?.flightNumber}
                                      </span>
                                    </div>
                                    <div className="me-4 text-3">
                                      کلاس نرخی:
                                      <span className="color-black en pe-2">
                                        {segment?.fareClass}
                                      </span>
                                    </div>
                                    {/* <div className="me-4 text-3">
                                          ترمینال:
                                          <span className="color-black en pe-2">
                                            {segment?.terminal || '-'}
                                          </span>
                                        </div> */}
                                  </>
                                )}
                              </div>
                              {!isDesktop && (
                                <>
                                  <div className="d-flex flex-row mb-2">
                                    <div className="d-flex flex-row col-8 align-items-start">
                                      <div className="text-4 text-weight-200">
                                        {segment?.airline}
                                      </div>
                                    </div>
                                    <div className="d-flex flex-row justify-content-end col-4 en">
                                      {segment?.airplaneCode}
                                    </div>
                                  </div>
                                  <div className="d-flex flex-row justify-content-around text-2 mt-2">
                                    <div>
                                      <span className="d-flex ms-1 color-grey-1">
                                        شماره پرواز:
                                        <span className="color-black en pe-2">
                                          {segment?.flightNumber}
                                        </span>
                                      </span>
                                    </div>
                                    <div>
                                      <span className="d-flex ms-1 color-grey-1">
                                        کلاس نرخی:
                                        <span className="color-black en pe-2">
                                          {segment?.fareClass}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="pe-5 py-3 position-relative">
                          <div className="pb-4">
                            <div className="col d-flex align-items-center">
                              <span className="color-primary text-5 text-weight-500 ps-1">
                                {segment.departureTime}
                              </span>
                              <span className="color-primary px-2">{segment.originCity}</span>
                              <span className="text-2">
                                <span className="ps-1 text-3">
                                  {segment.departureDate} -{' '}
                                  <span className="en">{segment.departureEnglishDate}</span>
                                </span>
                              </span>
                            </div>
                            <div className="color-grey-1 text-3">
                              {segment.originAirport} ({segment.originIata})
                            </div>
                          </div>
                          <span className="color-grey-1 text-3 d-flex">
                            <span className="ps-1">{segment.durationHours} ساعت</span>
                            {segment.durationMinutes
                              ? ` و ${segment.durationMinutes} دقیقه `
                              : null}
                          </span>
                          <div>
                            <div className="col d-flex align-items-center pt-4">
                              <span className="color-primary text-5 text-weight-500 ps-1">
                                {segment.arrivalTime}
                              </span>
                              <span className="color-primary  px-2">{segment.destinationCity}</span>
                              <span className="text-2">
                                <span className="ps-1 text-3">
                                  {segment.arrivalDate} -{' '}
                                  <span className="en">{segment.arrivalEnglishDate}</span>
                                </span>
                              </span>
                            </div>
                            <div className="color-grey-1 text-3">
                              {segment.destinationAirport}({segment.destinationIata})
                            </div>
                          </div>
                          <div className={styles['ticket-detail__content-timeInfo']}>
                            <div className={styles['ticket-detail__content-timeInfo--circle']} />
                            <div className={styles['ticket-detail__content-timeInfo--trail']} />
                            <div className={styles['ticket-detail__content-timeInfo--circle']} />
                          </div>
                        </div>{' '}
                        <div className="d-flex flex-column text-2 color-red text-center">
                          {segment?.allowBaggage.map((info, allowBaggageIndex) => {
                            return (
                              <Fragment key={allowBaggageIndex}>
                                <div className="d-flex flex-row align-items-start pb-1">
                                  {info.passengerType.includes('ADULT') ? (
                                    <div className={styles['ticket-detail__content__luggage']}>
                                      <LuggageIcon />
                                    </div>
                                  ) : (
                                    <div
                                      className={cn(
                                        styles['ticket-detail__content__child'],
                                        'px-1',
                                      )}
                                    >
                                      <ChildIcon />
                                    </div>
                                  )}

                                  <span className="ps-2">
                                    {` بار مجاز ${PersianPassengerType[info.passengerType]} :`}
                                  </span>
                                  <div>{info.baggageDisplayText}</div>
                                </div>
                              </Fragment>
                            );
                          })}
                        </div>
                        <TechnicalStop text={segment?.technicalStop} />
                        {!!segment.codeShare && (
                          <div
                            className={cn(
                              'alert alert-warning d-flex flex-row mt-3',
                              styles['ticket-detail__content__code-share'],
                            )}
                          >
                            <div className="ps-1">
                              <InfoIcon />
                            </div>
                            <p className="pr-1 mb-0">{segment.codeShare}</p>
                          </div>
                        )}
                        {item.segments.length > 1 && index !== item.segments.length - 1 && (
                          <div className={cn(styles['ticket-detail__content__stop'], 'mt-3')}>
                            <div className="align-self-center col-1 text-center">
                              <StopOver />
                            </div>
                            <div
                              className={cn(
                                !isDesktop ? 'd-flex flex-column me-3' : 'col-11 d-flex',
                              )}
                            >
                              <div className={cn(isDesktop && 'col-5')}>
                                {segment.destinationStopDurationHour} ساعت
                                {segment.destinationStopDurationMinutes
                                  ? ` و ${segment.destinationStopDurationMinutes}  دقیقه توقف  `
                                  : ' توقف'}
                              </div>
                              <div
                                className={cn(
                                  isDesktop && 'col-6 text-start align-self-center',
                                  'text-2',
                                )}
                              >
                                {segment.destinationAirport}({segment.destinationIata})
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
    </>
  );
};

export default IntelFlightDetail;
