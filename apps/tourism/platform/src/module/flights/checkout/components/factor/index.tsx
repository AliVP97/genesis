import React, { Fragment, useState, useEffect, useRef } from 'react';
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
import { GetOrder } from 'services/domestic/flight/interface';
import { useHasReturn } from './hook/useHasReturn';
import { DiscountInput } from 'components/discountInput';
import { UseDiscountReturnType } from 'components/discount/types/discountTypes';

type Props = {
  order: GetOrder;
} & UseDiscountReturnType;

const getPassengerAgeTypeLabel = (ageType: string | undefined) => {
  switch (ageType) {
    case 'AGE_TYPE_ADULT':
      return 'بزرگسال';
    case 'AGE_TYPE_CHILD':
      return 'کودک';
    case 'AGE_TYPE_INFANT':
      return 'نوزاد';
    default:
      return '';
  }
};

const InvoiceFactor = ({
  order,
  submitHandler,
  changeHandler,
  clearHandler,
  isLoading,
  status,
  message,
  isDisabledBtn,
}: Props) => {
  const tableComponentSpec = useRef<HTMLDivElement>(null);
  const FactorComponentSpec = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetect();

  const [expand, setExpand] = useState<boolean>(false);
  const { hasReturn } = useHasReturn(order);

  useEffect(() => {
    if (FactorComponentSpec.current) {
      if (expand) {
        FactorComponentSpec.current!.style.height =
          tableComponentSpec.current!.clientHeight + 60 + 'px';
        setTimeout(() => {
          FactorComponentSpec.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        FactorComponentSpec.current!.style.height = 0 + 'px';
      }
    }
  }, [expand]);

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
          <>
            <div className="w-100 d-flex flex-column py-4 px-3">
              <div>
                <span className="text-3">
                  اگر کد تخفیف دارید،‌ آن را وارد کنید و دکمه اعمال کد را بزنید.
                </span>
              </div>
              <form className="mt-3" onSubmit={submitHandler}>
                <DiscountInput
                  name="discountCode"
                  defaultValue={order?.payment?.discountCode}
                  isLoading={isLoading}
                  status={status}
                  onChange={changeHandler}
                  onClear={clearHandler}
                  message={message}
                  isSubmitDisabled={isDisabledBtn}
                />
              </form>
            </div>
          </>
        )}
        {isMobile && (
          <Accordion className={styles.invoice__accordion__totalPrice} allowZeroExpanded>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className={cn('text-3 text-weight-500 d-flex align-items-center p-3')}>
                    <span className="color-green-1 col">مبلغ قابل پرداخت </span>
                    <span className="color-green-1 text-5 text-weight-500">
                      {Number(order?.payment?.totalPrice)?.toLocaleString()}{' '}
                      <span className="text-2">ریال</span>
                    </span>
                    <ArrowDownIcon className={styles.invoice__expandIcon} />
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel className="bg-color-white-1 p-3" style={{ borderRadius: '18px' }}>
                {order?.passengers?.map(({ passenger }, i) => (
                  <Fragment key={passenger?.passengerID}>
                    <div className="d-flex align-items-center">
                      <div className={cn('text-3 text-weight-500 d-flex align-items-center col')}>
                        <span className="col d-flex">
                          <div className="ms-1">{passenger?.firstname?.farsi}</div>
                          <div>{passenger?.lastname?.farsi}</div>

                          <span className="text-2 color-grey-2 me-2">
                            {getPassengerAgeTypeLabel(passenger?.ageType)}
                          </span>
                        </span>
                      </div>
                      <div className="color-primary">
                        <span className="text-weight-500">
                          {Number(
                            order?.passengers?.[i]?.tickets?.[1]
                              ? Number(order?.passengers?.[i]?.tickets?.[0]?.payment?.price) +
                                  Number(order?.passengers?.[i]?.tickets?.[1]?.payment?.price)
                              : order?.passengers?.[i]?.tickets?.[0]?.payment?.price,
                          )?.toLocaleString()}{' '}
                        </span>
                        <span className="text-2 ">ریال</span>
                      </div>
                    </div>
                    {order?.passengers?.[i]?.tickets?.[1] && (
                      <>
                        <div className="d-flex align-items-center">
                          <span className="col color-grey-1 text-3">رفت</span>
                          <div>
                            <span className="text-weight-500 color-grey-1">
                              {Number(
                                order?.passengers?.[i]?.tickets?.[0]?.payment?.price,
                              )?.toLocaleString()}{' '}
                            </span>
                            <span className="text-2 color-grey-1">ریال</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="col color-grey-1 text-3">برگشت </span>
                          <div>
                            <span className="text-weight-500 color-grey-1">
                              {Number(
                                order?.passengers?.[i]?.tickets?.[1]?.payment?.price,
                              )?.toLocaleString()}{' '}
                            </span>
                            <span className="text-2 color-grey-1">ریال</span>
                          </div>
                        </div>
                      </>
                    )}
                  </Fragment>
                ))}
                <div className={cn(styles.invoice__divider, 'my-3')} />
                <div className="d-flex justify-content-between">
                  <span> مبلغ کل </span>
                  <div>
                    <span className="text-4 text-weight-500">
                      {order?.payment?.price ? Number(order?.payment?.price).toLocaleString() : 0}
                    </span>
                    <small> ریال</small>
                  </div>
                </div>
                <div className={cn(styles.invoice__divider, 'my-3')} />
                <div className="d-flex justify-content-between">
                  <span> استرداد بدون جریمه </span>
                  <div>
                    <span className="text-4 text-weight-500">
                      {order?.payment?.packageZeroRefundAmount
                        ? Number(order?.payment?.packageZeroRefundAmount).toLocaleString()
                        : 0}
                    </span>
                    <small> ریال</small>
                  </div>
                </div>
                <div className={cn(styles.invoice__divider, 'my-3')} />
                <div className="d-flex justify-content-between">
                  <span> تخفیف </span>
                  <div>
                    <span className="text-4 text-weight-500">
                      {order?.payment?.discount
                        ? Number(order?.payment?.discount).toLocaleString()
                        : 0}
                    </span>
                    <small> ریال</small>
                  </div>
                </div>
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
                    <span>هزینه بلیط</span>
                  </th>
                  <th>
                    <span>استرداد بدون جریمه</span>
                  </th>
                  <th>
                    <span>تخفیف</span>
                  </th>
                  <th className="color-green-1 text-weight-800">
                    <span>مبلغ قابل پرداخت</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className={cn(styles['invoice__inside-table__content'], 'w-100 text-center')}>
                  <td>
                    <span className={cn(styles.invoice__font, 'text-weight-600')}>
                      {Number(order.payment?.price || 0).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                  <td>
                    <span className={cn(styles.invoice__font, 'text-weight-600')}>
                      {Number(order.payment?.packageZeroRefundAmount || 0).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                  <td>
                    <span className={cn(styles.invoice__font, 'text-weight-600')}>
                      {Number(order?.payment?.discount || 0).toLocaleString()}
                    </span>
                    <span> ریال</span>
                  </td>
                  <td className="color-green-1">
                    <span className={cn(styles['invoice__large-font'], 'text-weight-800')}>
                      {Number(order?.payment?.totalPrice).toLocaleString()}
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
              styles.invoice__collapse,
              expand ? styles.invoice__collapse__expand : '',
              // @ts-ignore
              order!.passengers?.length < 3 ? styles['invoice__collapse__expand--hide-scroll'] : '',
            )}
            id="expand"
            ref={FactorComponentSpec}
          >
            <div className="d-flex align-items-center color-grey-1 text-weight-500 pe-3 border-top border-grey-2 py-2">
              <FactorIcon />
              <span className="pe-2">جزییات فاکتور</span>
            </div>
            <div className="mb-3 px-5 py-3" ref={tableComponentSpec}>
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
                    <th>
                      <span>استرداد بدون جریمه</span>
                    </th>
                    <th>
                      <span>{hasReturn ? 'قیمت رفت' : 'قیمت بلیط'}</span>
                    </th>
                    {hasReturn && (
                      <th>
                        <span>قیمت برگشت</span>
                      </th>
                    )}
                    <th className="color-primary text-weight-800">
                      <span>مجموع قیمت</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order?.passengers?.map(({ passenger, tickets }, index) => {
                    return (
                      <tr
                        className={cn(
                          styles['invoice__inside-table__content'],
                          'w-100 text-center',
                        )}
                        key={index.toString() + passenger?.passengerID}
                      >
                        <td className="d-flex flex-column align-items-center my-3">
                          <div className={cn(styles.invoice__font, 'text-weight-500')}>
                            {passenger?.firstname?.english} {passenger?.lastname?.english}
                          </div>
                          <div className="color-grey-1">
                            {passenger?.firstname?.farsi} {passenger?.lastname?.farsi}
                          </div>
                        </td>
                        <td>
                          <span>{getPassengerAgeTypeLabel(passenger?.ageType)}</span>
                        </td>
                        <td>
                          <span className={cn(styles.invoice__font, 'text-weight-600')}>
                            {(
                              Number(tickets?.[0]?.payment?.packageZeroRefundAmount ?? 0) +
                              Number(tickets?.[1]?.payment?.packageZeroRefundAmount ?? 0)
                            ).toLocaleString()}
                          </span>
                          <span> ریال</span>
                        </td>
                        <td>
                          <span className={cn(styles.invoice__font, 'text-weight-600')}>
                            {Number(tickets?.[0]?.payment?.price).toLocaleString()}
                          </span>
                          <span> ریال</span>
                        </td>
                        {hasReturn && (
                          <td>
                            <span className={cn(styles.invoice__font, 'text-weight-600')}>
                              {Number(tickets?.[1]?.payment?.price).toLocaleString() ?? 0}
                            </span>
                            <span> ریال</span>
                          </td>
                        )}
                        <td className="color-primary">
                          <span className={cn(styles.invoice__font, 'text-weight-800')}>
                            {(
                              Number(tickets?.[0]?.payment?.totalPrice ?? 0) +
                              Number(tickets?.[1]?.payment?.totalPrice ?? 0)
                            ).toLocaleString()}
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
            className="m-0 text-3 w-100 pb-3 d-flex justify-content-center cursor-pointer"
            onClick={!expand ? () => setExpand(true) : () => setExpand(false)}
          >
            <span>{!expand ? 'مشاهده جزییات فاکتور' : 'بستن جزییات فاکتور'}</span>
            {!expand ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceFactor;
