import React, { Fragment, useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import styles from '../../styles/invoice.module.scss';
import { ArrowDownIcon, ArrowUpIcon, FactorIcon } from 'assets/icons';
import cn from 'classnames';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { PersianPassengerType } from 'module/internationalFlight/tickets/interface';
import GetOrderResponseV2 from '../../types/GetOrderResponseV2';
import { DiscountInput } from 'components/discountInput';
import { UseDiscountReturnType } from 'components/discount/types/discountTypes';

interface InvoiceFactorProps {
  order: GetOrderResponseV2;
  discountHandler?: UseDiscountReturnType;
}

const InvoiceFactor = ({ order, discountHandler }: InvoiceFactorProps) => {
  const { isMobile } = useDeviceDetect();
  const [expand, setExpand] = useState<boolean>(false);
  const desktopLayout: HTMLElement = document.getElementById('expand')!;
  const zeroRefund = order?.order?.services?.[0]?.serviceDetail?.[0];

  useEffect(() => {
    if (expand) {
      setTimeout(() => {
        desktopLayout?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [expand]);

  const priceData = [
    {
      title: 'تخفیف',
      value: Number(order?.order?.discount?.amount).toLocaleString(),
    },
    {
      title: 'مبلغ کل',
      value: Number(order?.order?.priceInfo?.price).toLocaleString(),
    },
  ];

  return (
    <div className={cn(styles.invoice__table, 'mx-auto', !isMobile && 'mb-3')}>
      <div
        className={cn(
          styles.invoice__table__header,
          'd-flex align-items-center  color-grey-1 text-weight-500 pe-3',
        )}
      >
        <FactorIcon />
        <span className="pe-2">فاکتور</span>
      </div>
      <div className={cn(isMobile ? 'mb-3' : 'px-5 py-3')}>
        {isMobile && (
          <div className={cn(styles.invoice__accordion, 'p-3 ')}>
            <form onSubmit={discountHandler?.submitHandler}>
              <DiscountInput
                disabled={discountHandler?.isDisabled}
                name="discountCode"
                defaultValue={order.order?.discount?.code}
                isLoading={discountHandler?.isLoading}
                onChange={discountHandler?.changeHandler}
                onClear={discountHandler?.clearHandler}
                message={discountHandler?.message}
                status={discountHandler?.status}
              />
            </form>
            {zeroRefund?.selected && (
              <div className="alert alert-info rounded-4 border-0 fs-3 mt-3" role="alert">
                با انتخاب استرداد بدون جریمه، استفاده از کد تخفیف امکان‌پذیر نیست.
              </div>
            )}
          </div>
        )}
        {isMobile && (
          <Accordion className={styles.invoice__accordion__totalPrice} allowZeroExpanded>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className={cn('text-3 text-weight-500 d-flex align-items-center p-3')}>
                    <span className="color-green-1 col">مبلغ قابل پرداخت </span>
                    <span className="color-green-1 text-5 text-weight-500">
                      {Number(order?.order?.priceInfo?.price)?.toLocaleString()}{' '}
                      <span className="text-2">ريال </span>
                    </span>
                    <ArrowDownIcon className={styles.invoice__expandIcon} />
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="bg-color-white-1 p-3" style={{ borderRadius: '18px' }}>
                {order?.order?.passengers?.map((passenger) => (
                  <Fragment key={passenger?.passengerId}>
                    <div className="d-flex align-items-center">
                      <div className={cn('text-3 text-weight-500 d-flex align-items-center col')}>
                        <span className="col d-flex flex-wrap">
                          <div>{passenger?.lastName?.english} </div>
                          <div className="me-1">{passenger?.firstName?.english}</div>
                          <span className="text-2 color-grey-2 me-2">
                            ({PersianPassengerType['PASSENGER_TYPE_' + passenger.passengerType!]})
                          </span>
                        </span>
                      </div>
                      <div className="color-primary">
                        <span className="text-weight-500">
                          {Number(
                            order?.order?.itinerary?.fareBreakdowns?.find(
                              (item) => item.passengerType == passenger.passengerType,
                            )?.totalPrice,
                          )?.toLocaleString()}{' '}
                        </span>
                        <span className="text-2 ">ریال</span>
                      </div>
                    </div>

                    <div className={cn(styles.invoice__divider, 'my-3')}></div>
                  </Fragment>
                ))}
                {zeroRefund?.selected ? (
                  <>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>استرداد بدون جریمه</span>
                      <div className="color-primary">
                        <div>
                          <span className="text-weight-500">
                            {Number(zeroRefund?.price).toLocaleString()}
                          </span>{' '}
                          <span className="text-2">ریال</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn(styles.invoice__divider, 'my-3')} />
                  </>
                ) : null}
                {priceData.map(({ title, value }, index) => (
                  <>
                    {!!value && (
                      <>
                        <div
                          className="d-flex align-items-center justify-content-between"
                          key={index}
                        >
                          <span>{title}</span>
                          <div className="color-primary">
                            <div>
                              <span className="text-weight-500">{value}</span>{' '}
                              <span className="text-2">ریال</span>
                            </div>
                          </div>
                        </div>
                        <div className={cn(styles.invoice__divider, 'my-3')}></div>
                      </>
                    )}
                  </>
                ))}
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        )}
        {!isMobile && (
          <>
            <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
              <thead>
                <tr
                  className={cn(
                    styles['invoice__inside-table__header'],
                    'w-100 m-0 color-grey-1 text-center',
                  )}
                >
                  <th>
                    <span>مبلغ بلیت</span>
                  </th>
                  {zeroRefund?.selected && (
                    <th>
                      <span>استرداد بدون جریمه</span>
                    </th>
                  )}
                  <th>
                    <span>تخفیف</span>
                  </th>
                  <th className="color-green-1 text-weight-800">
                    <span>قابل پرداخت</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={cn(styles['invoice__inside-table__content'], 'w-100 text-center')}>
                  <td>
                    <span className={cn(styles.invoice__font, 'text-weight-600')}>
                      {Number(order.order?.itinerary?.priceInfo?.price).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                  {zeroRefund?.selected && (
                    <td>
                      <span className={cn(styles.invoice__font, 'text-weight-600')}>
                        {Number(zeroRefund?.price).toLocaleString()}
                      </span>
                      <span> ریال</span>
                    </td>
                  )}
                  <td>
                    <span className={cn(styles.invoice__font, 'text-weight-600')}>
                      {Number(order?.order?.discount?.amount).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                  <td className="color-green-1">
                    <span className={cn(styles['invoice__large-font'], 'text-weight-800')}>
                      {Number(order?.order?.priceInfo?.price).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
      {!isMobile && (
        <>
          <div
            className={cn(
              expand ? 'd-none' : 'm-0 text-3 w-100 pb-3 d-flex justify-content-center',
              'cursor-pointer',
            )}
            onClick={() => setExpand(true)}
          >
            <span>مشاهده جزییات فاکتور</span>
            <ArrowDownIcon />
          </div>
          <div
            className={cn(
              styles.invoice__collapse,
              expand ? styles.invoice__collapse__expand : '',
              order!.order && order!.order?.passengers!.length < 3
                ? styles['invoice__collapse__expand--hide-scroll']
                : '',
            )}
            id="expand"
          >
            <div className="d-flex align-items-center color-grey-1 text-weight-500 pe-3 border-top border-grey-2 py-2">
              <FactorIcon />
              <span className="pe-2">جزییات فاکتور</span>
            </div>
            <div className="mb-3 px-5 py-3">
              <table className={cn(styles['invoice__inside-table'], 'w-100 m-0')}>
                <thead>
                  <tr
                    className={cn(
                      styles['invoice__inside-table__header'],
                      'w-100 m-0 color-grey-1 text-center',
                    )}
                  >
                    <th>
                      <span>نام و نام خانوادگی</span>
                    </th>
                    <th>
                      <span>نوع مسافر</span>
                    </th>
                    <th className="color-primary text-weight-800">
                      <span>مجموع قیمت</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order?.order?.passengers?.map((passenger, index) => {
                    return (
                      <tr
                        className={cn(
                          styles['invoice__inside-table__content'],
                          'w-100 text-center',
                        )}
                        key={index.toString() + passenger?.passengerId + 'passengers'}
                      >
                        <td className="d-flex flex-column align-items-center my-3">
                          <div className={cn(styles.invoice__font, 'text-weight-500')}>
                            {passenger?.firstName?.english} {passenger?.lastName?.english}
                          </div>
                          <div className="color-grey-1">
                            {passenger?.firstName?.persian} {passenger?.lastName?.persian}
                          </div>
                        </td>
                        <td>
                          <span>
                            {passenger?.passengerType === 'ADULT'
                              ? 'بزرگسال'
                              : passenger?.passengerType === 'CHILD'
                                ? 'کودک'
                                : passenger?.passengerType === 'INFANT'
                                  ? 'نوزاد'
                                  : ''}
                          </span>
                        </td>

                        <td className="color-primary">
                          <span className={cn(styles.invoice__font, 'text-weight-800')}>
                            {Number(
                              order?.order?.itinerary?.fareBreakdowns?.find(
                                (item) => item.passengerType == passenger.passengerType,
                              )?.totalPrice,
                            )?.toLocaleString()}{' '}
                          </span>
                          <span> ریال</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className={cn(
              !expand ? 'd-none' : 'm-0 text-3 w-100 pb-3 d-flex justify-content-center',
              'cursor-pointer',
            )}
            onClick={() => setExpand(false)}
          >
            <span>بستن جزییات فاکتور</span>
            <ArrowUpIcon />
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceFactor;
