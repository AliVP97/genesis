import { ShareIcon } from 'assets/icons';
import React, { useEffect } from 'react';
import cn from 'classnames';
import jwt_decode from 'jwt-decode';
import styles from '../../styles/invoice.module.scss';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Input from 'components/input';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { toLatin } from '../../../../../utils/helpers/numbers';
import { validationMobile } from '../../../../../utils/helpers/validations';

interface ShareTicketForm {
  phoneNumber: string;
  email: string;
}
const InvoiceShare = ({
  getPhoneNumber,
  getEmail,
}: {
  getPhoneNumber: (mobileNumber: string) => void;
  getEmail: (email: string) => void;
}) => {
  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ShareTicketForm>({
    defaultValues: {
      phoneNumber: '',
      email: '',
    },
  });

  const { isMobile } = useDeviceDetect();

  const onSubmit: SubmitHandler<ShareTicketForm> = (data) => {
    getPhoneNumber(toLatin(data.phoneNumber));
    getEmail(data.email);
  };

  const resetInput = (name: string | undefined) => {
    clearErrors(name as keyof ShareTicketForm);
    resetField(name as keyof ShareTicketForm);
  };

  useEffect(() => {
    const token = localStorage.getItem('UATP');
    const decode: { mobile?: string } = token ? jwt_decode(token) : { mobile: '' };
    if (decode.mobile) {
      setValue('phoneNumber', decode.mobile);
    }
  }, []);

  return (
    <div className={cn(isMobile ? styles['invoice__share'] : styles['invoice__table'], 'mx-auto')}>
      <div
        className={cn(
          isMobile ? styles['invoice__share--header'] : styles['invoice__table__header'],
          'pe-3',
        )}
      >
        <ShareIcon />
        <span className="pe-2">اطلاع رسانی سفر</span>
      </div>
      <div className={cn('mb-1 p-3', !isMobile && 'px-4 pt-3 pb-1')}>
        <span className={cn('text-2 d-flex', !isMobile && 'text-3')}>
          بلیط و اطلاع رسانی‌های بعد از خرید به این شماره موبایل و ایمیل ارسال میشود. در صورت نیاز
          اطلاعات زیر را ویرایش نمایید.{' '}
        </span>
      </div>
      <div className={cn('px-3 pb-1 px-md-3 pb-md-1', !isMobile && 'mb-3 px-5 pt-0 pb-3')}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-lg-flex row"
          id="shareForm"
          onChange={() => {
            const values = getValues();
            getPhoneNumber(values.phoneNumber);
            getEmail(values.email);
          }}
        >
          <Controller
            name="phoneNumber"
            rules={{
              required: true,
              maxLength: 11,
              validate: (value: string) => validationMobile(value) || 'شماره موبایل صحیح نمیباشد',
            }}
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.phoneNumber}
                label="شماره موبایل"
                errorText="وارد کردن شماره موبایل اجباری است"
                className="col-lg-3 col-md-6"
                handleChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.email}
                label="ایمیل ( اختیاری ):"
                errorText="وارد کردن آدرس ایمیل اجباری است"
                className="col-lg-3 col-md-6"
                handleChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </form>
      </div>
    </div>
  );
};

export default InvoiceShare;
