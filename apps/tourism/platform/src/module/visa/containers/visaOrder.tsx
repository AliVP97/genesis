import React, { useEffect } from 'react';
import { russiaLandingDesktop, dubaiLandingDesktop } from 'assets/images';
import Button from 'components/button';
import Image from 'next/image';
import cn from 'classnames';
import styles from './dubaiVisa.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { Info, Passenger, SuccessIcon } from 'assets/icons';
import InputGenerator from 'containers/passengers/formGenerator';
import { content } from 'module/visa/content';
import { useRouter } from 'next/router';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useOrderVisa } from 'module/visa/hooks/useOrderVisa';
import { TPayloadOrderVisa } from 'services/visa/interface';
import { FromSchema } from 'containers/passengers/utilities/types';
import { validations } from './validations';
import VisaOrderTable from './components/visaOrderTable';
import { VisaTracking } from 'utils/ecommerce/application/mappers/visa/events';
import { TVisaAddToCartEvent } from 'utils/ecommerce/application/mappers/visa/types';
import { useAuthContext } from 'utils/hooks/useAuthContext';

type TPropsForm = {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
  passport_no: string;
  passport_exp: string;
};

const VisaOrderContainer = () => {
  const { isMobile } = useDeviceDetect();
  const { push, query } = useRouter();
  const visaTracking = new VisaTracking();
  const { login, checkAuth } = useAuthContext();
  useEffect(() => {
    queueMicrotask(() => {
      if (!login) {
        checkAuth({ closable: login, visible: !login });
      }
    });
  }, [login]);
  const orderData = query.visaName === 'russia' ? content.russia : content.dubai;

  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const visaType = String(query.visaType)?.split('-', 2);

  const landingImage = query.visaName === 'russia' ? russiaLandingDesktop : dubaiLandingDesktop;

  const dynamicVisaForms: Array<Array<FromSchema>> = [
    [
      {
        name: 'first_name',
        label: 'نام لاتین',
        type: 'text',
        placeholder: '',
        rules: validations.LatinFirstName,
        visible: true,
      },
      {
        name: 'last_name',
        label: 'نام خانوادگی لاتین',
        type: 'text',
        placeholder: '',
        rules: validations.LatinLastName,
        visible: true,
      },
      {
        name: 'email',
        label: 'ایمیل',
        type: 'text',
        placeholder: '',
        rules: validations.Email,
        visible: true,
      },
      {
        name: 'passport_no',
        label: 'شماره پاسپورت',
        type: 'text',
        placeholder: '',
        rules: validations.PassportNumber,
        visible: true,
      },
      {
        name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
        label: 'تاریخ انقضای پاسپورت',
        type: 'timeSelector',
        isJalali: false,
        isEnMonthDaysFull: true,
        rules: {
          required: {
            value: true,
            message: 'تاریخ انقضای پاسپورت الزامی می باشد',
          },
        },
        visible: true,
      },
    ],
  ];

  const errorMessage = (name: string | string[]): boolean => {
    if (Array.isArray(name)) return name.some((_, index) => errors.hasOwnProperty(name[index]));
    return Boolean(errors[name]);
  };

  const resetInput = (name: string) => {
    clearErrors(name as keyof TPropsForm);
    resetField(name as keyof TPropsForm);
    setValue(name, '');
  };

  const { orderVisaMutate, orderVisaDataLoading, orderVisaStatus } = useOrderVisa();

  const visaTrackingModelCreator = (): TVisaAddToCartEvent => {
    const adult = Number(query?.numberAdults);
    const child = Number(query?.numberMinors);
    const infant = Number(query?.numberBabies);
    const checkoutEvent: TVisaAddToCartEvent = {
      quantity: adult + child + infant,
      item_varient: `${query?.visaType}`,
      item_category2: Number(query?.visaRenewal),
      item_brand: orderData.title,
    };
    return checkoutEvent;
  };

  useEffect(() => {
    visaTracking.beginCheckout(visaTrackingModelCreator());
  }, []);
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    data.passport_exp = `${data.ExpireYear}-${data.ExpireMonth}-${data.ExpireDay}`;
    delete data.ExpireYear;
    delete data.ExpireMonth;
    delete data.ExpireDay;
    delete data.mobile_number;
    data.renewal_visa = Number(query?.visaRenewal);
    data.staying_time = visaType[1];
    data.visa_type = visaType[0];
    data.number_adults = Number(query.numberAdults);
    data.number_minors = Number(query.numberMinors);
    data.number_babies = Number(query.numberBabies);
    data.visa_name = query.visaName;
    data.service_type = 'visa';
    visaTracking.addPaymentInfo(visaTrackingModelCreator());
    orderVisaMutate(data as TPayloadOrderVisa);
  };

  return (
    <div dir="rtl">
      <div className="text-center mx-n3 ">
        <Image src={landingImage} alt="visa" />
      </div>
      <div className={cn(!isMobile && 'container')}>
        <div className={styles['visa-order-container']}>
          <div className={styles['visa-order-container__title']}>
            <div className={styles['visa-order-container__title__center-text']}>
              <Image
                className="rounded-2 border border-2 border-light"
                src={orderData.image}
                alt="visa-uae"
                width={isMobile ? 70 : 80}
                height={isMobile ? 40 : 50}
              />
              <span className="fs-4 color-on-surface">{orderData.title}</span>
            </div>
            {orderVisaStatus !== 'success' && (
              <div className={styles['visa-order-container__title__end-button']}>
                <button
                  className={styles['visa-order-container__return-button']}
                  onClick={() => {
                    visaTracking.removeFromCart(visaTrackingModelCreator());
                    push('/visa');
                  }}
                >
                  تغییر ویزا
                </button>
              </div>
            )}
          </div>
          {orderVisaStatus !== 'success' && (
            <>
              <div className={styles['visa-detail-container__divider']} />
              <div className="mt-4">
                <VisaOrderTable data={visaType} />
              </div>
            </>
          )}
        </div>
        {orderVisaStatus === 'success' ? (
          <div className={styles['visa-order-container__confirm-section']}>
            <div className="m-lg-4 mt-4 text-center">
              <SuccessIcon style={{ transform: isMobile ? 'scale(2.4)' : 'scale(3.6)' }} />
              <p
                className={
                  isMobile ? 'color-success mt-4 fw-bold' : 'color-success mt-5 text-6 fw-bold'
                }
              >
                درخواست ویزای شما با موفقیت ثبت شد
              </p>
              <p className={isMobile ? 'fs-3 fw-500' : 'fs-4 fw-500'}>
                به زودی برای هماهنگی با شما تماس گرفته خواهد شد.
              </p>
              <div className={isMobile ? 'fs-3' : 'fs-4'}>
                {isMobile ? (
                  <p className="text-justify">
                    تایید ویزا منوط به تصمیم سفارت کشور مقصد است و هف‌هشتاد هیچ مسئولیتی در قبال رد
                    ویزا ندارد. در صورت نیاز به مدارک اضافی، پردازش ویزا می‌تواند تا ۱۰ روز کاری با
                    تاخیر انجام شود.
                  </p>
                ) : (
                  <>
                    <span>
                      تایید ویزا منوط به تصمیم سفارت کشور مقصد است و هف‌هشتاد هیچ مسئولیتی در قبال
                      رد ویزا ندارد.
                    </span>
                    <p>
                      در صورت نیاز به مدارک اضافی، پردازش ویزا می‌تواند تا ۱۰ روز کاری به تاخیر
                      بیفتد.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
              <button
                onClick={() => push('/visa')}
                className={styles['visa-order-container__confirm-section__return-button']}
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['visa-order-container__form']}>
              <div className={styles['visa-order-container__form__title']}>
                <Passenger />
                <span className={cn('color-on-surface', isMobile ? 'fw-500' : 'fw-bold')}>
                  اطلاعات اولیه
                </span>
              </div>
              <div className={styles['visa-detail-container__divider']} />
              <div className={isMobile ? 'p-0' : 'px-3'}>
                <p className={cn('color-on-surface', isMobile ? 'text-3 py-3' : 'py-3')}>
                  لطفا اطلاعات اولیه را برای ثبت درخواست وارد نمایید.
                </p>
                <div className="row pb-3">
                  {dynamicVisaForms?.map((form) => {
                    return form.map((item, index) => {
                      return (
                        <div key={index.toString() + item.name} className="col-12 col-md-3">
                          <InputGenerator
                            rules={item.rules}
                            error={errors[item.name as string]?.message as string}
                            control={control}
                            isError={errorMessage(item.name)}
                            resetInput={(e: string) => resetInput(e)}
                            defaultValue={item.defaultValue}
                            setValue={setValue}
                            watch={watch}
                            {...item}
                            className="fs-3"
                          />
                        </div>
                      );
                    });
                  })}
                </div>
                <div className={styles['visa-detail-container__divider-dashed']} />
                <div>
                  {orderData.reservationRules.map((item) => (
                    <div key={item} className={isMobile ? 'my-2' : 'my-4'}>
                      <Info style={{ scale: '0.7' }} />
                      <span
                        className={
                          isMobile
                            ? 'fs-2 color-on-surface-var me-2 text-justify'
                            : 'fs-3 color-on-surface-var me-2'
                        }
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="bg-color-surface mx-n3 px-3 py-4">
                <div className="d-flex gap-2">
                  <Info />
                  <span className="fs-2 color-on-surface-var">
                    با کلیک روی تایید و ادامه خرید با{' '}
                    <a
                      className="text-decoration-none"
                      href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms/flight`}
                    >
                      قوانین سایت
                    </a>{' '}
                    موافقت کرده‌اید.
                  </span>
                </div>
              </div>
            )}
            <div className={styles['visa-order-container__form__footer']}>
              {!isMobile && (
                <div className="d-flex gap-2">
                  <Info />
                  <span className="fs-3 color-grey-1">
                    با کلیک روی تایید و ادامه خرید با{' '}
                    <a
                      className="text-decoration-none "
                      href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms/visa`}
                    >
                      قوانین سایت
                    </a>{' '}
                    موافقت کرده‌اید.
                  </span>
                </div>
              )}
              <div className={isMobile ? 'd-flex flex-column-reverse w-100 gap-2' : 'd-flex gap-3'}>
                <button
                  onClick={() => push('/visa/dubai-visa')}
                  className={styles['visa-order-container__form__footer__return-button']}
                >
                  بازگشت
                </button>
                <Button
                  className={styles['visa-order-container__form__footer__submit-button']}
                  btnType="submit"
                  loading={orderVisaDataLoading}
                >
                  ثبت درخواست
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default VisaOrderContainer;
