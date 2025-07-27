import Button from 'components/button';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import styles from './tourOrderTable.module.scss';

import { OutlinedUser } from 'assets/icons';
import InputGenerator from 'containers/passengers/formGenerator';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

import { useTourPrice } from '../../hooks/useTourPrice';

import { useRouter } from 'next/router';
import {
  domesticPersonalDynamicForms,
  commentDynamicForms,
  internationalPersonalDynamicForms,
} from './constants/tourOrder';

import { useFormData } from './hooks/useFormData';
import PolicyTextDesktop from './components/policyText/policyTextDesktop';
import PolicyTextMobile from './components/policyText/policyTextMobile';
import TourOrderInvoice from './components/tourOrderInvoice';

import React, { useRef, useState } from 'react';
import PaymentMethods from 'components/payment/desktopCard';
import Modal from 'components/modal';
import cn from 'classnames';
import { TtourCreateOrderRequest } from 'services/tour/register/interface';
import { PaymentBottomSheet } from 'components/PaymentBottomSheet';
import { tourPostOrder } from 'services/tour/register';
import { FromSchema } from 'containers/passengers/utilities/types';
import { tourValidation } from 'utils/validations';
import { TTourGetCheckoutResponse } from 'services/tour/v2/checkout/type';
import { useHandlePayment } from './hooks/useHandlePayment';

type TPropsForm = {
  firstName: string;
  lastName: string;
  phone: string;
  nationalCode: string;
  email: string;
  passportNo: string;
  passportExpireDate: string;
  adultNumber: number;
  childNumber: number;
  infantNumber: number;
};
const SNAPPAY_GATEWAY_ID = 6;

const TourOrderForm = ({ data }: { data: TTourGetCheckoutResponse }) => {
  const { query, back } = useRouter();
  const [gatewayId, setGatewayId] = useState<undefined | number>();
  const snapPayGateWayId = gatewayId === 6;

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [submitSource, setSubmitSource] = useState<'form' | 'modal' | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const {
    resetField,
    clearErrors,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const { isMobile } = useDeviceDetect();

  const { totalSum } = useTourPrice(data, getValues, 177);

  const { formData } = useFormData(data, totalSum, getValues, data?.tripType as string);
  const [paymentBottomSheet, setPaymentBottomSheet] = useState(false);
  const phone = getValues('phone');
  const formRef = useRef<HTMLFormElement>(null);

  const payload = {
    packageDateId: query?.id,
    nationalCode: formData?.national_code,
    firstName: formData?.first_name,
    lastName: formData?.last_name,
    email: formData?.email,
    passportNumber: formData?.passport_number || '',
    passportExpireDate: formData?.passport_expire_date || '',
    adultNo: formData?.adult_no,
    childNoWithBed: formData?.kids_no_with_bed,
    childNoWithoutBed: formData?.kids_no_without_bed,
    infantNo: formData?.baby_no,
    description: formData?.description,
    totalPrice: formData?.total_price,
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {
    tourPostOrderMutate,
    orderTourPostOrder,
    tourGatewayLoading,
    tourPaymentOrderLoading,
    walletLoading,
  } = useHandlePayment({
    phone,
    gatewayId,
  });
  const handlePaymentFlow = () => {
    if (isMobile && !paymentBottomSheet) {
      setPaymentBottomSheet(true);
    } else {
      tourPostOrderMutate(payload as TtourCreateOrderRequest);
    }
  };
  const handleVisibleModal = () => {
    setIsOpenModal((prevState) => !prevState);
  };

  const onSubmit: SubmitHandler<FieldValues> = () => {
    if (submitSource !== 'form' && submitSource !== 'modal') return;
    if (submitSource === 'form') {
      if (!snapPayGateWayId || isOpenModal) {
        handlePaymentFlow();
        return;
      }
      handleVisibleModal();
      return;
    }

    handlePaymentFlow();
  };

  const disableButton =
    orderTourPostOrder || tourGatewayLoading || tourPaymentOrderLoading || walletLoading;

  const personalDynamicForms = Array(
    domesticPersonalDynamicForms[0].concat(internationalPersonalDynamicForms[0]),
  );

  const tourPassengerForm: Array<Array<FromSchema>> = [
    [
      {
        name: 'adultNumber',
        label: 'تعداد بزرگسال ',
        type: 'select',
        placeholder: '',
        rules: tourValidation?.adultNumber,
        visible: true,
        defaultValue: data?.adultNo,
      },
      {
        name: 'childNumber',
        label: 'تعداد کودک با تخت (7  تا 12  سال)',
        type: 'select',
        placeholder: '',
        rules: tourValidation.childNumber,
        visible: true,
        defaultValue: data?.childNoWithBed,
      },
      {
        name: 'childWithoutBedNumber',
        label: 'تعداد کودک بدون تخت (3  تا 6  سال)',
        type: 'select',
        placeholder: '',
        rules: tourValidation.childNumber,
        visible: true,
        defaultValue: data?.childNoWithoutBed,
      },
      {
        name: 'infantNumber',
        label: 'تعداد نوزاد (0  تا 2  سال)',
        type: 'select',
        placeholder: '',
        rules: tourValidation.infantNumber,
        visible: true,
        defaultValue: data?.infantNo,
      },
    ],
  ];
  const tourPersonalForms =
    data.tripType == 'INTERNATIONAL' ? personalDynamicForms : domesticPersonalDynamicForms;

  const errorMessage = (name: string | string[]): boolean => {
    if (Array.isArray(name)) return name.some((_, index) => errors.hasOwnProperty(name[index]));
    return Boolean(errors[name]);
  };

  const resetInput = (name: string) => {
    clearErrors(name as keyof TPropsForm);
    resetField(name as keyof TPropsForm);
    setValue(name, '');
  };

  const onCreate = async () => {
    const { orderId } = await tourPostOrder(payload as TtourCreateOrderRequest);
    return orderId;
  };
  const handleGatewayChange = (Id: number) => {
    if (Id === SNAPPAY_GATEWAY_ID) {
      setVisible(true);
    }
  };

  return (
    <>
      <form id={'tourOrderForm'} onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <div className={styles['tour-order-container__form']}>
          <div className={styles['tour-order-container__form__title']}>
            <OutlinedUser />
            <span className={isMobile ? 'fw-500' : 'fw-bold'}>سرپرست مسافران</span>
          </div>
          <div className={styles['tour-detail-container__divider']} />
          <div className={isMobile ? 'p-0' : 'px-3'}>
            <p className={isMobile ? 'text-3 py-3' : 'color-black-1 py-3'}>اطلاعات فردی</p>
            <div className="row pb-3">
              {tourPersonalForms?.map((form) => {
                return form.map((item, index) => {
                  return (
                    <div key={index.toString() + 'tour' + item.name} className="col-12 col-md-3">
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
            <div className={styles['tour-detail-container__divider-dashed']} />
          </div>
          <div className={isMobile ? 'p-0' : 'px-3'}>
            <p className={isMobile ? 'text-3 py-3' : 'color-black-1 py-3'}>تعداد مسافران</p>
            <div className="row pb-3">
              {tourPassengerForm?.map((form) => {
                return form.map((item, index) => {
                  return (
                    <div key={index.toString() + item.label + 'tour'} className="col-12 col-md-3">
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
            <div className={styles['tour-detail-container__divider-dashed']} />
          </div>
          <div className={isMobile ? 'p-0' : 'px-3'}>
            <p className={isMobile ? 'text-3 py-3' : 'color-black-1 py-3'}>
              توضیحات (درصورت توضیحات لازم، لطفا فرم زیر را تکمیل نمایید.)
            </p>
            <div className="row pb-3">
              {commentDynamicForms?.map((form) => {
                return form.map((item, index) => {
                  return (
                    <div key={index.toString() + 'tour' + item.type} className="col-12 col-md-9">
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
          </div>
        </div>
        <TourOrderInvoice data={data} getValues={getValues} watch={watch} />
        {!isMobile ? (
          <PaymentMethods
            serviceId={177}
            setGatewayId={setGatewayId}
            data={data}
            getValues={getValues}
          />
        ) : null}
        {isMobile && <PolicyTextMobile type={query.type as string} />}
        <div className={styles['tour-order-container__form__footer']}>
          {!isMobile && <PolicyTextDesktop type={query.type as string} />}
          <div className={isMobile ? 'd-flex flex-column-reverse w-100 gap-2' : 'd-flex gap-3'}>
            <button
              type="button"
              className={styles['tour-order-container__form__footer__return-button']}
              onClick={() => {
                back();
              }}
            >
              انصراف
            </button>
            <Button
              loading={disableButton}
              btnType="submit"
              disabled={disableButton}
              onClick={() => setSubmitSource('form')}
              className={styles['tour-order-container__form__footer__submit-button']}
            >
              ادامه
            </Button>
          </div>
        </div>
        {isMobile ? (
          <>
            <PaymentBottomSheet
              open={paymentBottomSheet}
              onDismiss={() => setPaymentBottomSheet(false)}
              paymentHookOptions={{ onCreate }}
              onGatewayChange={handleGatewayChange}
            />
          </>
        ) : null}
        {!isMobile && (
          <Modal onClose={handleVisibleModal} visible={isOpenModal}>
            <div className="bg-white rounded-4 overflow-hidden d-flex flex-column justify-content-center align-items-center p-3 w-50">
              <div className="text-weight-500"> شرایط پرداخت قسطی</div>
              <div className="pt-3 text-center pb-4">
                در صورتی که بعد از خرید نیاز به کنسل کردن سفارش خود داشته باشید، مبلغ اعتبار به صورت
                کامل به حساب اسنپ پی شما باز میگردد و مبلغ جریمه به صورت نقدی توسط هف‌هشتاد از شما
                دریافت می‌شود
              </div>
              <div className="d-flex flex-row row w-100 justify-content-between ">
                <Button
                  loading={disableButton}
                  btnType="submit"
                  disabled={disableButton}
                  onClick={() => setSubmitSource('modal')}
                  form="tourOrderForm"
                  className={cn(
                    styles['tour-order-container__form__footer__submit-button'],
                    'col-6',
                  )}
                >
                  تایید و ادامه
                </Button>
                <Button
                  radius
                  className={cn(
                    styles['tour-order-container__form__footer__cancel-btn'],
                    'col-md-6',
                  )}
                  btnType="button"
                  onClick={() => {
                    setIsOpenModal((prevState) => !prevState);
                  }}
                >
                  انصراف
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </form>
      <Modal onClose={() => setVisible(false)} visible={visible}>
        <div className="bg-white rounded-4 overflow-hidden d-flex flex-column justify-content-center align-items-center p-3">
          <div className="text-weight-500">شرایط پرداخت قسطی</div>

          <div className="pt-3 text-center pb-4">
            در صورتی که بعد از خرید نیاز به کنسل کردن سفارش خود داشته باشید، مبلغ اعتبار به صورت
            کامل به حساب اسنپ پی شما باز میگردد و مبلغ جریمه به صورت نقدی توسط هف‌هشتاد از شما
            دریافت می‌شود
          </div>

          <div
            onTouchEnd={() => setVisible((prevState) => !prevState)}
            className="bg-color-primary color-white rounded-pill px-5 mb-3 p-2"
          >
            تایید و ادامه
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TourOrderForm;
