import React, { Fragment, useState } from 'react';
import cn from 'classnames';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Input from 'components/input';
import SwitchButton from 'components/switchButton';
import { CheckoutFormProps } from 'module/train/passengers/tabSelect/interface';
import { TrainOrder } from 'services/train/orders/interface';
import { useResponsive } from 'utils/hooks/useResponsive';
import { getCompartmentTotalPrice, getPassengerTotalPrice, tariff2AgeType } from '../../helper';
import DesktopFactor from './desktop';

import { ArrowDownIcon, FactorIcon } from 'assets/icons';
import styles from '../../styles/invoice.module.scss';

interface Props {
  order: TrainOrder;
}

const Factor = ({ order }: Props) => {
  const { isMobile } = useResponsive();

  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<CheckoutFormProps>({
    defaultValues: {
      OffCode: '',
    },
  });
  const [offCode, setOffCode] = useState('');

  const onSubmit: SubmitHandler<CheckoutFormProps> = (data) => setOffCode(data.OffCode);
  const resetInput = (name: string | undefined) => {
    clearErrors(name as keyof CheckoutFormProps);
    resetField(name as keyof CheckoutFormProps);
    setOffCode('');
  };

  return (
    <div className={cn(styles['invoice__table'], 'mx-auto', !isMobile && 'mb-3')}>
      <div
        className={cn(
          styles['invoice__table__header'],
          'd-flex align-items-center  color-grey-1 text-weight-500 pe-3',
        )}
      >
        <FactorIcon />
        <span className="pe-2">فاکتور</span>
      </div>
      <div className={cn(isMobile ? 'mb-3' : 'px-5 py-3')}>
        {isMobile && (
          <Accordion className={cn(styles['invoice__accordion'], 'p-3 ')} allowZeroExpanded>
            <AccordionItem className="d-flex flex-column align-items-center">
              <div className="w-100 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-3">کد تخفيف دارم </span>
                </div>
                <AccordionItemHeading className="me-auto">
                  <AccordionItemButton className="d-flex">
                    <SwitchButton />
                  </AccordionItemButton>
                </AccordionItemHeading>
              </div>
              <AccordionItemPanel className="accordion__panel w-100 px-0">
                <>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name="OffCode"
                      rules={{ required: false }}
                      control={control}
                      render={({ field }) => (
                        <Input
                          field={field}
                          clearInput={resetInput}
                          isError={!!errors.OffCode}
                          label="تخفیف"
                          errorText="کد تخفیف وارد شده صحیح نمی باشد"
                          suffix={
                            <button className={styles['invoice__offCode__btn']} type="submit">
                              اعمال کد تخفیف{' '}
                            </button>
                          }
                          suffixClassName={styles['invoice__offCode__suffix']}
                          isFocused={true}
                          handleChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </form>
                  {offCode != '' && (
                    <span className="color-red text-2 d-flex align-items-center justify-content-center">
                      کد تخفیف وارد شده صحیح نمی باشد{' '}
                    </span>
                  )}
                </>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        )}
        {isMobile && (
          <Accordion className={styles['invoice__accordion__totalPrice']} allowZeroExpanded>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className={cn('text-3 text-weight-500 d-flex align-items-center p-3')}>
                    <span className="color-green-1 col">مبلغ قابل پرداخت </span>
                    <span className="color-green-1 text-5 text-weight-500">
                      {Number(order?.price)?.toLocaleString()} <span className="text-2">ریال</span>
                    </span>
                    <ArrowDownIcon className={styles['invoice__expandIcon']} />
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel
                className="bg-color-white p-3 text-3"
                style={{ borderRadius: '18px' }}
              >
                {order.trips?.[0]?.tickets?.map((ticket, ticketIndex) => (
                  <Fragment key={ticket.id}>
                    <div className=" d-flex align-items-center mb-1">
                      <div className="col d-flex align-items-center">
                        <div className="ms-1">
                          {ticket.passenger?.isForeign
                            ? ticket.passenger?.englishFirstName
                            : ticket.passenger?.firstName}
                        </div>
                        <div className="ms-1">
                          {ticket.passenger?.isForeign
                            ? ticket.passenger?.englishLastName
                            : ticket.passenger?.lastName}
                        </div>
                        <span className={styles['invoice__accordion__age-type']}>
                          {tariff2AgeType[ticket.tariff!]}
                        </span>
                      </div>
                      <div className="color-primary d-flex align-items-center">
                        <div className="text-4 text-weight-500">
                          {getPassengerTotalPrice(order, ticket, ticketIndex)}
                        </div>{' '}
                        <div className="text-2 me-1">ریال</div>
                      </div>
                    </div>

                    <div className="color-grey-1 text-3 d-flex mt-2">
                      <span className="col text-2">
                        {ticket.passenger?.isForeign
                          ? 'هزینه بلیط رفت (غیر ایرانی)'
                          : 'هزینه بلیط رفت'}
                      </span>
                      <span
                        className={cn(
                          styles['invoice__accordion__options'],
                          'col justify-content-end  d-flex',
                        )}
                      >
                        {Number(ticket.price).toLocaleString()}{' '}
                        <div className="text-2 me-1">ریال</div>
                      </span>
                    </div>

                    {order?.trips?.[1] && (
                      <div className="color-grey-1 text-3 d-flex mt-2">
                        <span className="col text-2">
                          {ticket.passenger?.isForeign
                            ? 'هزینه بلیط برگشت (غیر ایرانی)'
                            : 'هزینه بلیط برگشت'}
                        </span>
                        <span
                          className={cn(
                            styles['invoice__accordion__options'],
                            'col justify-content-end d-flex',
                          )}
                        >
                          {Number(
                            order?.trips?.[1].tickets?.[ticketIndex]?.price,
                          ).toLocaleString() || '-'}
                          <div className="text-2 me-1">ریال</div>
                        </span>
                      </div>
                    )}

                    {ticket?.option?.[0]?.name && (
                      <>
                        <div className="col mt-2 text-2 text-weight-500">
                          خدمات و پذیرایی (قطار رفت)
                        </div>
                        {[...ticket?.option, ...(ticket?.freeOption || [])]?.map(
                          ({ id, name, price }) => (
                            <div
                              key={id}
                              className="d-flex justify-content-between mt-2 color-grey-1 text-2"
                            >
                              <span>{name}</span>
                              <span
                                className={cn(
                                  styles['invoice__accordion__options'],
                                  'col justify-content-end  d-flex',
                                )}
                              >
                                {Number(price) === 0
                                  ? 'رایگان'
                                  : Number(price).toLocaleString() + 'ریال' || '-'}
                              </span>
                            </div>
                          ),
                        )}
                      </>
                    )}

                    {order?.trips?.[1] && (
                      <>
                        <div className="col mt-2 text-2 text-weight-500">
                          خدمات و پذیرایی (قطار برگشت)
                        </div>
                        {[
                          ...(order?.trips?.[1].tickets?.[ticketIndex]?.option || []),
                          ...(order?.trips?.[1].tickets?.[ticketIndex]?.freeOption || []),
                        ]?.map(({ id, name, price }) => (
                          <div
                            key={id}
                            className="d-flex justify-content-between mt-2 color-grey-1 text-2"
                          >
                            <span>{name}</span>
                            <span
                              className={cn(
                                styles['invoice__accordion__options'],
                                'col justify-content-end  d-flex',
                              )}
                            >
                              {Number(price) === 0
                                ? 'رایگان'
                                : Number(price).toLocaleString() + 'ریال' || '-'}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                    <div className={cn(styles['invoice__divider'], 'my-3')} />
                  </Fragment>
                ))}
                {!!order.trips?.find((trip) =>
                  trip.trainInfo?.priceDetail?.find((item) => item.tariff === 'TARIFF_EMPTY'),
                ) && (
                  <Fragment>
                    <div className=" d-flex align-items-center">
                      <div className="col d-flex align-items-center">کوپه دربست</div>
                      <div className="color-primary d-flex ">
                        <div className="text-weight-500">{getCompartmentTotalPrice(order)}</div>
                        <div className="text-2 me-1">ریال</div>
                      </div>
                    </div>

                    <div className="color-grey-1 text-3 d-flex py-2">
                      رفت
                      <div className="pe-1">
                        (
                        {
                          order.trips?.[0].trainInfo?.priceDetail?.find(
                            (item) => item.tariff === 'TARIFF_EMPTY',
                          )?.count
                        }
                        صندلی خالی )
                      </div>
                      <span
                        className={cn(
                          styles['invoice__accordion__options'],
                          'col justify-content-end  d-flex',
                        )}
                      >
                        {Number(
                          order.trips?.[0].trainInfo?.priceDetail?.find(
                            (item) => item.tariff === 'TARIFF_EMPTY',
                          )?.totalPrice,
                        ).toLocaleString()}{' '}
                        <div className="text-2 me-1">ریال</div>
                      </span>
                    </div>

                    {order.trips?.[1]?.trainInfo?.priceDetail?.find(
                      (item) => item.tariff === 'TARIFF_EMPTY',
                    ) && (
                      <div className="color-grey-1 text-3 d-flex py-2">
                        برگشت
                        <div className="pe-1">
                          (
                          {
                            order.trips?.[1].trainInfo?.priceDetail?.find(
                              (item) => item.tariff === 'TARIFF_EMPTY',
                            )?.count
                          }
                          صندلی خالی )
                        </div>
                        <span
                          className={cn(
                            styles['invoice__accordion__options'],
                            'col justify-content-end  d-flex',
                          )}
                        >
                          {Number(
                            order.trips?.[1].trainInfo?.priceDetail?.find(
                              (item) => item.tariff === 'TARIFF_EMPTY',
                            )?.totalPrice,
                          ).toLocaleString()}{' '}
                          <div className="text-2 me-1">ریال</div>
                        </span>
                      </div>
                    )}
                  </Fragment>
                )}
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        )}
      </div>
      {!isMobile && <DesktopFactor order={order} />}
    </div>
  );
};

export default Factor;
