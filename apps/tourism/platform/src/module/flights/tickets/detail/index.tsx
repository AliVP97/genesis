import React, { useEffect, useState } from 'react';
import { TicketType } from 'module/flights/tickets/ticket/interface';
import styles from './detail.module.scss';

import cn from 'classnames';
import TicketDetail from '../ticket/ticketDetail';
import { TabType } from '../interface';
import { useSearchQueryContext } from 'utils/hooks/useSearchQueryContext';
import { GetOrder } from 'services/domestic/flight/interface';
import { renderPassengerType } from './components/passengerType';

interface Props {
  ticket: TicketType;
  order?: GetOrder;
}

const Detail = ({ ticket, order }: Props) => {
  const adultPrice = ticket?.fare?.adult;
  const infantPrice = ticket?.fare?.infant;
  const childPrice = ticket?.fare?.child;

  // @ts-ignore
  const { queryState: query, setQueryState } = useSearchQueryContext();

  useEffect(() => {
    const searchQuery = JSON.parse(localStorage.getItem('search-query') as string);
    setQueryState(searchQuery);
  }, []);

  const totalPrice =
    Number(adultPrice) * Number(query?.adult) +
    Number(infantPrice) * Number(query?.infant) +
    Number(childPrice) * Number(query?.child);

  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const handleSelectTab = (str: TabType) => setActiveTab(str);

  const adultPassengers = order?.passengers?.filter(
    (x) => x.passenger?.ageType === 'AGE_TYPE_ADULT',
  ).length;
  const childPassengers = order?.passengers?.filter(
    (x) => x.passenger?.ageType === 'AGE_TYPE_CHILD',
  ).length;
  const infantPassengers = order?.passengers?.filter(
    (x) => x.passenger?.ageType === 'AGE_TYPE_INFANT',
  ).length;

  const orderTotalPrice =
    Number(adultPrice) * Number(adultPassengers) +
    Number(infantPrice) * Number(infantPassengers) +
    Number(childPrice) * Number(childPassengers);
  const options = [
    {
      label: 'جزییات پرواز',
      value: TabType.DETAIL,
    },
    {
      label: 'قوانین استرداد',
      value: TabType.POLICY,
    },
  ];

  const backgroundColor =
    ticket?.suggestType === 'SUGGESTION_TYPE_NEAREST'
      ? '#EAF1F8'
      : ticket?.suggestType === 'SUGGESTION_TYPE_LOWESTPRICE'
        ? '#D7F2E7'
        : 'transparent';

  return (
    <div
      className="p-3 rounded-bottom"
      style={{
        backgroundColor,
      }}
    >
      <div className={styles['detail__content']}>
        <div className="col-7 mx-2 p-3">
          <div className={cn('d-flex', styles['detail__item--divider'])}>
            {options.map((item) => (
              <div
                className={cn(
                  'd-flex px-4 pb-2',
                  item.value === activeTab
                    ? styles['detail__item--options--active']
                    : styles['detail__item--options'],
                )}
                onClick={() => handleSelectTab(item.value)}
                key={item.value}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <TicketDetail activeTab={activeTab} data={ticket} />
        </div>
        <div className="col-5 mx=2 p-3">
          <div className={styles['detail__item']}>جزییات قیمت</div>
          <div className="ps-3 py-3">
            <div className={cn('p-3 bg-color-white-1', styles['detail__background'])}>
              <div className={cn('row')}>
                {order ? (
                  <>
                    {renderPassengerType(
                      'بزرگسال',
                      '( ۱۲ سال به بالا )',
                      adultPassengers!,
                      adultPrice!,
                    )}
                    {renderPassengerType('کودک', '( ۲ تا ۱۲ سال )', childPassengers!, childPrice!)}
                    {renderPassengerType(
                      'نوزاد',
                      '(10 روز تا 2 سال )',
                      infantPassengers!,
                      infantPrice!,
                    )}
                  </>
                ) : (
                  <>
                    {query?.adult !== '0' &&
                      renderPassengerType(
                        'بزرگسال',
                        '( ۱۲ سال به بالا )',
                        Number(query?.adult),
                        adultPrice!,
                      )}
                    {query?.child !== '0' &&
                      renderPassengerType(
                        'کودک',
                        '( ۲ تا ۱۲ سال )',
                        Number(query?.child),
                        childPrice!,
                      )}
                    {query?.infant !== '0' &&
                      renderPassengerType(
                        'نوزاد',
                        '(10 روز تا 2 سال )',
                        Number(query?.infant),
                        infantPrice!,
                      )}
                  </>
                )}

                <div>
                  <div className={styles['detail__divider']} />
                </div>
              </div>
              <div>
                <div className="d-flex">
                  <div className="col text-end text-3 d-flex align-items-center">مجموع قیمت</div>
                  <div dir="rtl" className="color-primary col text-start">
                    <span className="text-5 text-weight-500">
                      {order ? orderTotalPrice.toLocaleString() : totalPrice.toLocaleString()}
                    </span>
                    <span className="text-3 me-1">ریال</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
