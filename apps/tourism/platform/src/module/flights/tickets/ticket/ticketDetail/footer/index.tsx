import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import cn from 'classnames';
import styles from '../ticketDetail.module.scss';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TabType, TicketType } from 'module/flights/tickets/ticket/interface';
import Spinner from '../../../../../../components/spinner';
import { useRouteChange } from '../../../../../../utils/hooks/useRouteChange';
import { useAuthContext } from 'utils/hooks/useAuthContext';

interface Props {
  data: TicketType;
  activeTab?: TabType;
  onSelectTicket?: (data: TicketType) => void;
  setShowDetail: Dispatch<SetStateAction<boolean>>;
}

export const DetailFooter = ({
  data,
  onSelectTicket,
  returning,
  setShowDetail,
}: Required<
  Pick<Props, 'data' | 'onSelectTicket' | 'setShowDetail'> & {
    returning: boolean;
  }
>) => {
  const { query } = useRouter();

  const adultPrice = data?.fare?.adult;
  const infantPrice = data?.fare?.infant;
  const childPrice = data?.fare?.child;
  const totalPrice =
    Number(adultPrice) * (Number(query?.adult) || 1) +
    Number(infantPrice) * (Number(query?.infant) || 0) +
    Number(childPrice) * (Number(query?.child) || 0);

  const [showPriceDetail, setShowPriceDetail] = useState(false);

  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  const [isloginStarted, setIsLoginStarted] = useState(false);
  const { login, setLoginModalVisible, visible } = useAuthContext();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  const handleLogin = () => {
    if (login) {
      setSearchButtonClicked(true);
      onSelectTicket(data);
    } else {
      setIsLoginStarted(true);
      setLoginModalVisible(true);
      setShowDetail(false);
    }
  };
  useEffect(() => {
    if (isloginStarted && login) {
      setIsLoginStarted(false);
      setSearchButtonClicked(true);
      onSelectTicket?.(data);
    }
  }, [login]);
  useEffect(() => {
    if (!visible) {
      setIsLoginStarted(false);
    }
  }, [visible]);
  let ticketButtonLabel;
  if (searchButtonClicked && routeChangeStarted) {
    ticketButtonLabel = <Spinner />;
  } else if (returning) {
    ticketButtonLabel = 'انتخاب بلیط برگشت';
  } else if (query.returningDate) {
    ticketButtonLabel = 'انتخاب بلیط رفت';
  } else {
    ticketButtonLabel = 'انتخاب بلیط';
  }

  return (
    <div className={cn(styles['ticket-detail__footer'], 'p-3')}>
      <div
        className={cn(
          showPriceDetail
            ? styles['ticket-detail__footer--withPriceDetail']
            : styles['ticket-detail__footer--withoutPriceDetail'],
          'row',
        )}
      >
        {query?.adult != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">بزرگسال</span>
              <span className="text-2 m-1">( ۱۲ سال به بالا ) </span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1 ">x {query?.adult}</span>
              <span className="color-grey-1">
                {adultPrice && adultPrice.toLocaleString()} <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        {query?.child != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">کودک</span>
              <span className="text-2 m-1">( ۲ تا ۱۲ سال )</span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1">x {query?.child}</span>
              <span className="color-grey-1">
                {childPrice && childPrice.toLocaleString()} <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        {query?.infant != '0' && (
          <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
            <div className="color-grey-1" dir="rtl">
              <span className="text-3">نوزاد</span>
              <span className="text-2 m-1">(10 روز تا 2 سال )</span>
            </div>

            <div dir="rtl" className="d-flex align-items-center">
              <span className="color-tertiary text-weight-bold text-3 ms-1">x {query?.infant}</span>
              <span className="color-grey-1">
                {infantPrice && infantPrice.toLocaleString()} <span className="text-2">ریال</span>
              </span>
            </div>
          </div>
        )}
        <div className={styles['ticket-detail__divider']} />
      </div>

      <div
        onClick={() => setShowPriceDetail(!showPriceDetail)}
        className={styles['ticket-detail__footer__history']}
      >
        <div className="d-flex flex-row-reverse">
          <div className="col text-end">
            {showPriceDetail ? <ArrowDownIcon /> : <ArrowUpIcon />}
            مجموع قیمت
          </div>
          <div dir="rtl" className="color-primary col text-start">
            <span className="text-5 text-weight-500">{totalPrice.toLocaleString()}</span>
            <span className="text-3 me-1">ریال</span>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <button
          onClick={() => {
            handleLogin();
          }}
          className={cn(
            styles['ticket-detail__footer__btn'],
            'justify-content-center d-flex align-items-center text-weight-500',
            searchButtonClicked &&
              routeChangeStarted &&
              styles['ticket-detail__footer__btn--loading'],
          )}
        >
          {ticketButtonLabel}
        </button>
      </div>
    </div>
  );
};
