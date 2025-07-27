import React, { Dispatch, FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import cn from 'classnames';

import Input from 'components/input';
import { toLatin } from 'utils/helpers/numbers';
import { emailRegex, validateMobile } from 'utils/helpers/validations';
import { ShareIcon } from 'assets/icons';
import { TContactState } from '../../hooks';

import styles from '../../styles/invoice.module.scss';

interface ShareTicketForm {
  phoneNumber: string;
  email: string;
}

type TShareProps = {
  contactState: [TContactState, Dispatch<React.SetStateAction<TContactState>>];
  setIsValidContactInfo: Dispatch<React.SetStateAction<boolean>>;
};

const mobileValidationHandler = (value: string) =>
  validateMobile(value) || 'شماره موبایل صحیح نمیباشد';

const emailValidationHandler = (value: string) => {
  if (!value) {
    return true;
  } else {
    return emailRegex(value) || 'ایمیل را بصورت صحیح وارد نمایید';
  }
};

const Share: FC<TShareProps> = ({ contactState, setIsValidContactInfo }) => {
  const [contactInfo, setContactInfo] = contactState;

  const {
    control,
    trigger,
    resetField,
    reset,
    formState: { isValid },
  } = useForm<ShareTicketForm>({
    defaultValues: {
      phoneNumber: contactInfo.phoneNumber,
      email: '',
    },
    mode: 'onChange',
  });

  const handleChange = (name: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      hasChanged: true,
      [name]: value,
    }));
  };

  const resetInput = async (name: string) => {
    resetField(name as keyof ShareTicketForm, { defaultValue: '' });
    await trigger(name as keyof ShareTicketForm);

    setContactInfo((prev) => ({
      ...prev,
      hasChanged: true,
      [name]: '',
    }));
  };

  useEffect(() => {
    setIsValidContactInfo(isValid);
  }, [isValid]);

  useEffect(() => {
    if (contactInfo.hasChanged === false && (contactInfo.phoneNumber || contactInfo.email)) {
      reset({ phoneNumber: contactInfo.phoneNumber, email: contactInfo.email });
    }
  }, [contactInfo]);

  return (
    <div className={cn(styles['invoice__table'], 'mx-auto')}>
      <div className={cn(styles['invoice__table__header'], 'pe-3')}>
        <ShareIcon />
        <span className="pe-2">اطلاع رسانی سفر</span>
      </div>
      <div className={cn('mb-3 p-3')}>
        <span className={cn('text-3 d-flex psx-3 px-md-4')}>
          بلیط و اطلاع رسانی های بعد از خرید به این شماره موبایل و ایمیل ارسال می شود. در صورت نیاز
          اطلاعات زیر را ویرایش کنید.
        </span>
      </div>
      <div className={cn('px-3 px-md-5')}>
        <form className="d-lg-flex row">
          <Controller
            name="phoneNumber"
            rules={{
              required: 'شماره موبایل الزامی می باشد',
              validate: mobileValidationHandler,
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                field={{ ...field, maxLength: 11 }}
                inputMode="numeric"
                clearInput={resetInput}
                isError={!!error}
                label="شماره موبایل"
                errorText={error?.message}
                className="col-lg-3 col-md-6"
                handleChange={(e) => {
                  handleChange(field.name, toLatin(e.target.value));
                  field.onChange(toLatin(e.target.value));
                }}
              />
            )}
          />
          <Controller
            name="email"
            rules={{
              validate: emailValidationHandler,
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                field={field}
                clearInput={resetInput}
                isError={!!error}
                label="ایمیل ( اختیاری )"
                errorText={error?.message}
                className="col-lg-3 col-md-6"
                handleChange={(e) => {
                  handleChange(field.name, e.target.value);
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
        </form>
      </div>
    </div>
  );
};

export default Share;
