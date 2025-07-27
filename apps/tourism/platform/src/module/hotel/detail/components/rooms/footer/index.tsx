import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
// import {useIntl} from 'react-intl';
import cn from 'classnames';
import styles from '../rooms.module.scss';
import React, { useEffect, useRef, useState } from 'react';

import { TSelectedRoom } from '..';
import { TRoom } from 'services/hotel/detail/interface';
import UseCalculateTotalPrice from 'module/hotel/detail/hooks/useCalculateTotalPrice';
import { useRouteChange } from 'utils/hooks/useRouteChange';
import Spinner from 'components/spinner';
import { hasUndefinedProperty } from 'utils/helpers/hasUndefinedProperty';
interface Props {
  selectedRoom: TSelectedRoom;
  nights: number;
  loading: boolean;
  roomCount: number;
  handleClick: () => void;
}

export const RoomFooter = ({ selectedRoom, nights, handleClick, roomCount }: Props) => {
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { routeChangeStarted, routeChangeCompleted } = useRouteChange();
  useEffect(() => {
    routeChangeCompleted && searchButtonClicked && setSearchButtonClicked(false);
  }, [routeChangeCompleted]);

  const result = Object.values(selectedRoom).reduce(
    function (r, a) {
      if (a) {
        r[a![0]?.room?.roomId || ''] = r[a![0].room?.roomId || ''] || [];
        r[a![0]?.room?.roomId || ''].push(a || Object.create(null));
      }
      return r;
    },
    Object.create(null) as { [key: string]: Array<TRoom[]> },
  );

  const sum = UseCalculateTotalPrice(result);
  const [showPriceRoom, setShowPriceRoom] = useState(false);
  const platform = useRef<string | null | undefined>(null);
  useEffect(() => {
    platform.current = sessionStorage.getItem('platform');
  }, []);
  return (
    <div
      className={cn(
        styles['pkg__footer'],
        'p-3',
        platform.current === 'superapp' ? styles['pkg__footer--super-app'] : null,
      )}
    >
      <div
        className={cn(
          showPriceRoom
            ? styles['pkg__footer--withPriceDetail']
            : styles['pkg__footer--withoutPriceDetail'],
          'row',
        )}
      >
        {Object.values(result)?.map((room) => {
          return (
            <>
              <div className="d-flex justify-content-between flex-row-reverse align-items-center my-2">
                <div className="color-grey-1" dir="rtl">
                  <span className="text-3">{room![0]![0].room?.roomInfo?.name}</span>
                </div>
                <div dir="rtl" className="d-flex align-items-center">
                  <span className="color-tertiary text-weight-bold text-3 ms-1 ">
                    x {room?.length}
                  </span>
                  <span className="color-grey-1">
                    {room![0]![0]!.room?.priceDetail?.price?.totalPrice?.toLocaleString()}{' '}
                    <span className="text-2">{/* {f({id: 'ticket.price.rial'})} */}</span>
                  </span>
                </div>
              </div>
            </>
          );
        })}
        <div className={styles['ticket-detail__divider']} />
      </div>
      {Object.values(result).length > 0 && showPriceRoom ? <hr /> : null}
      <div
        onClick={() => setShowPriceRoom(!showPriceRoom)}
        className={styles['pkg__footer__history']}
      >
        <div className="d-flex flex-row-reverse">
          {nights ? (
            <>
              {' '}
              <div className="col text-end">
                {showPriceRoom ? <ArrowDownIcon /> : <ArrowUpIcon />}
                {`مجموع قیمت برای ${nights} شب`}
              </div>
              <div dir="rtl" className="color-primary col text-start">
                <span className="text-5 text-weight-500">{sum.result.toLocaleString()}</span>
                <span className="text-3 me-1">ریال</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="pt-3">
        <button
          onClick={() => {
            setSearchButtonClicked(true);
            handleClick();
          }}
          className={cn(
            styles['pkg__footer__btn'],
            (searchButtonClicked || routeChangeStarted) && styles['pkg__footer__btn--loading'],
          )}
          disabled={
            Object.keys(selectedRoom)?.length != roomCount ||
            sum.result <= 0 ||
            hasUndefinedProperty<TSelectedRoom>(selectedRoom)
          }
        >
          {searchButtonClicked || routeChangeStarted ? <Spinner /> : <> تایید و ادامه</>}
        </button>
      </div>
    </div>
  );
};
