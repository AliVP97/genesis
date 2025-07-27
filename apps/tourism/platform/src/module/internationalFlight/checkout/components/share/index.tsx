import { ShareIcon } from 'assets/icons';
import React, { useEffect } from 'react';
import cn from 'classnames';
import jwt_decode from 'jwt-decode';
import styles from '../../styles/invoice.module.scss';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Input from 'components/input';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
// import {IntMobileValidation} from 'utils/helpers/IntMobileValidation';
import { emailRegex } from 'utils/helpers/validations';

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
    mode: 'onChange',
  });

  const { isMobile } = useDeviceDetect();

  const onSubmit: SubmitHandler<ShareTicketForm> = (data) => {
    getPhoneNumber(data.phoneNumber);
    getEmail(data.email);
  };

  const resetInput = (name: string | undefined) => {
    clearErrors(name as keyof ShareTicketForm);
    resetField(name as keyof ShareTicketForm);
    if ((name = 'phoneNumber')) {
      getPhoneNumber('');
    } else {
      getEmail('');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('UATP');
    const decode: { mobile?: string } = token ? jwt_decode(token) : { mobile: '' };
    if (decode.mobile) {
      setValue('phoneNumber', decode.mobile);
    }
  }, []);

  return (
    <div className={cn(styles['invoice__table'], 'mx-auto')}>
      <div className={cn(styles['invoice__table__header'], 'pe-3')}>
        <ShareIcon />
        <span className="pe-2">اطلاع رسانی سفر</span>
      </div>
      <div className={cn('mb-3 p-3', !isMobile && 'px-5 pt-3 pb-0')}>
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
            // rules={{
            //   validate: (value: string) =>{
            //   if (!validationMobile(value))
            //   return 'شماره موبایل وارد شده صحیح نمیباشد';
            // }}}
            control={control}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.phoneNumber}
                maxLength={11}
                label="شماره موبایل"
                errorText={errors.phoneNumber?.message}
                className="col-lg-3 col-md-6"
                handleChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              validate: (value) => {
                if (!emailRegex(value)) return 'وارد کردن ایمیل اجباری می باشد';
              },
            }}
            render={({ field }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!errors.email}
                errorText={errors.email?.message}
                label="ایمیل ( اجباری ):"
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
