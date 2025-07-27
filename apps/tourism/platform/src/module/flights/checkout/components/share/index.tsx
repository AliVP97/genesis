import { ShareIcon } from 'assets/icons';
import React, { useEffect } from 'react';
import cn from 'classnames';
import jwt_decode from 'jwt-decode';
import styles from '../../styles/invoice.module.scss';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Input from 'components/input';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { toLatin } from 'utils/helpers/numbers';
import { emailRegex, validationMobile2 } from 'utils/helpers/validations';

interface ShareTicketForm {
  phoneNumber: string;
  email: string;
}
const InvoiceShare = ({
  getPhoneNumber,
  getEmail,
  isChanged,
  setFormErrors,
  isDisabled,
}: {
  getPhoneNumber: (mobileNumber: string) => void;
  getEmail: (email: string) => void;
  isChanged: (contactChange: boolean) => void;
  setFormErrors: (errors: boolean) => void;
  isDisabled?: boolean;
}) => {
  const {
    handleSubmit,
    resetField,
    clearErrors,
    control,
    setValue,
    getValues,
    trigger,
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
    getPhoneNumber(toLatin(data.phoneNumber));
    getEmail(data.email);
  };

  const resetInput = (name: string | undefined) => {
    if (isDisabled) return;
    isChanged(true);
    clearErrors(name as keyof ShareTicketForm);
    resetField(name as keyof ShareTicketForm);
    if (name === 'phoneNumber') {
      getPhoneNumber('');
      trigger('phoneNumber');
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

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      setFormErrors(false);
    } else {
      setFormErrors(true);
    }
  }, [errors.email, errors.phoneNumber]);

  return (
    <div className={cn(styles.invoice__table, 'mx-auto')}>
      <div className={cn(styles.invoice__table__header, 'pe-3')}>
        <ShareIcon />
        <span className="pe-2">اطلاع رسانی سفر</span>
      </div>
      <div className={cn('mb-3 p-3', !isMobile && 'px-5 pt-3 pb-0')}>
        <span className={cn('text-2 d-flex', !isMobile && 'text-3')}>
          بلیط و اطلاع رسانی‌‌های بعد از خرید به این شماره موبایل و ایمیل ارسال می‌شود. در صورت نیاز
          اطلاعات را ویرایش کنید.
        </span>
      </div>
      <div className={cn('px-3 pb-1 px-md-3 pb-md-1', !isMobile && 'mb-3 px-5 pt-0 pb-3')}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="shareForm"
          onChange={() => {
            isChanged(true);
            const { email, phoneNumber } = getValues();
            getPhoneNumber(phoneNumber);
            getEmail(email);
          }}
        >
          <fieldset disabled={isDisabled} className="d-lg-flex row">
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                validate: (value) => validationMobile2(value),
              }}
              render={({ field }) => (
                <Input
                  field={field}
                  clearInput={resetInput}
                  isError={!!errors.phoneNumber}
                  label="شماره موبایل"
                  errorText="شماره موبایل صحیح نمی باشد."
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
                  if (!(emailRegex(value) || !value)) return false;
                },
              }}
              render={({ field }) => (
                <Input
                  field={field}
                  clearInput={resetInput}
                  isError={!!errors.email}
                  label="ایمیل (اختیاری)"
                  errorText="ایمیل صحیح نمی باشد."
                  className="col-lg-3 col-md-6"
                  handleChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default InvoiceShare;
