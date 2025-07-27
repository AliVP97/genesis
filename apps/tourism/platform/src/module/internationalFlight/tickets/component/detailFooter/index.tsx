import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { TIntelTicket } from 'services/internationalFlight/detail/interface';
import styles from 'module/internationalFlight/tickets/component/intelFlightDetail/ticketDetail.module.scss';
import { useCreateOrder } from 'module/internationalFlight/tickets/hooks/useCreateOrder';
import Button from 'components/button';
import { TripMode } from 'module/flights/travels/helper/travelHelper';
import { useDispatch, useSelector } from 'react-redux';
import { FlightInternationalTracking } from 'utils/ecommerce/application/mappers/international-flight/events';
import { RootState } from 'store';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { internationalFlightCart } from 'store/slices/ecommerce/ecomerceSlice';

interface IProps {
  ticket: TIntelTicket;
  requestId: string;
  isDesktop: boolean;
  selectedTicket?: boolean;
  index?: number;
}
export const DetailFooter = ({ ticket, requestId, isDesktop, selectedTicket, index }: IProps) => {
  const [showPriceDetail, setShowPriceDetail] = useState(false);

  const initBaseFare = {
    adult: '0',
    child: '0',
    infant: '0',
  };
  const [baseFare, setBaseFare] = useState<{
    adult: string;
    child: string;
    infant: string;
  }>(initBaseFare);

  const { mutateCreateOrder, isCreateOrderLoading } = useCreateOrder();
  const dispatch = useDispatch();
  const { internationalFlightData } = useSelector(
    (state: RootState) => state?.ecommerceReducer?.ecomerceSlice,
  );
  const handleClick = () => {
    if (internationalFlightData instanceof Object && 'ticketsData' in internationalFlightData) {
      const CartObject: viewItemListModel = {
        ...(internationalFlightData as viewItemListModel),
        itinerary: ticket,
        itemPosition: index ?? 0,
      };
      const internationalFlightTracking = new FlightInternationalTracking();
      dispatch(internationalFlightCart({ data: CartObject }));
      internationalFlightTracking.addToCart(CartObject as viewItemListModel);
    }
    mutateCreateOrder({
      requestId: requestId,
      itineraryId: String(ticket.itineraryId),
    });
  };

  useEffect(() => {
    ticket?.fareBreakdowns?.map((item) => {
      if (item.passengerType?.includes('ADULT'))
        setBaseFare((prev) => {
          return {
            ...prev,
            adult: String(item.totalPrice),
          };
        });
      else if (item.passengerType?.includes('CHILD'))
        setBaseFare((prev) => {
          return {
            ...prev,
            child: String(item.totalPrice),
          };
        });
      else if (item.passengerType?.includes('INFANT'))
        setBaseFare((prev) => {
          return {
            ...prev,
            infant: String(item.totalPrice),
          };
        });
    });
  }, [ticket]);

  useEffect(() => {
    isDesktop && setShowPriceDetail(true);
  }, [isDesktop]);

  return (
    <div
      className={cn(
        isDesktop ? styles['ticket-detail__footer'] : styles['ticket-detail__footer--mobile'],
        'p-3',
      )}
    >
      <div
        className={cn(
          showPriceDetail
            ? styles['ticket-detail__footer--withPriceDetail']
            : styles['ticket-detail__footer--withoutPriceDetail'],
          'row ltr',
        )}
      >
        {baseFare.adult != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">بزرگسال</span>
              <span className="text-2 m-1">( ۱۲ سال به بالا )</span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1 ">
                x{' '}
                {
                  ticket?.fareBreakdowns?.find((x) => x.passengerType == 'PASSENGER_TYPE_ADULT')
                    ?.count
                }
              </span>
              <span className="color-grey-1">
                {baseFare?.adult && Number(baseFare?.adult).toLocaleString()}{' '}
                <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        {baseFare.child != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">کودک</span>
              <span className="text-2 m-1">( ۲ تا ۱۲ سال )</span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1">
                x{' '}
                {
                  ticket?.fareBreakdowns?.find((x) => x.passengerType == 'PASSENGER_TYPE_CHILD')
                    ?.count
                }
              </span>
              <span className="color-grey-1">
                {baseFare?.child && Number(baseFare.child).toLocaleString()}{' '}
                <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        {baseFare.infant != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">نوزاد</span>
              <span className="text-2 m-1">(10 روز تا 2 سال )</span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1">
                x{' '}
                {
                  ticket?.fareBreakdowns?.find((x) => x.passengerType == 'PASSENGER_TYPE_INFANT')
                    ?.count
                }
              </span>
              <span className="color-grey-1">
                {baseFare?.infant && Number(baseFare.infant).toLocaleString()}{' '}
                <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        <div className={styles['ticket-detail__divider']} />
      </div>
      <div
        onClick={() => !isDesktop && setShowPriceDetail(!showPriceDetail)}
        className={cn(styles['ticket-detail__footer__history'], 'ltr')}
      >
        <div className="d-flex flex-row-reverse text-3">
          <div className="col text-end">
            {!isDesktop && showPriceDetail ? (
              <ArrowDownIcon />
            ) : !isDesktop && !showPriceDetail ? (
              <ArrowUpIcon />
            ) : isDesktop ? (
              ''
            ) : (
              ''
            )}
            {ticket?.tripMode &&
            TripMode[
              ticket?.tripMode.toString() as
                | 'TRIP_MODE_ROUND_TRIP'
                | 'TRIP_MODE_UNDEFINED'
                | 'TRIP_MODE_ONEWAY'
            ] === 2
              ? 'مجموع قیمت رفت و برگشت'
              : 'مجموع قیمت'}
          </div>
          <div dir="rtl" className="color-primary col text-start">
            <span className="text-5 text-weight-500">
              {Number(ticket?.priceInfo?.price).toLocaleString()}
            </span>
            <span className="text-3 me-1">ریال</span>
          </div>
        </div>
      </div>
      {!selectedTicket && (
        <div className="pt-3">
          <Button
            onClick={handleClick}
            className={cn(
              styles['ticket-detail__footer__btn'],
              'justify-content-center d-flex align-items-center text-weight-500',
            )}
            loading={isCreateOrderLoading}
          >
            انتخاب بلیط و افزودن مسافر
          </Button>
        </div>
      )}
    </div>
  );
};
