import React from 'react';

import { useRouter } from 'next/router';
import cn from 'classnames';
import { Controller, useFormContext } from 'react-hook-form';

import Input from 'components/input';
import { toLatin } from 'utils/helpers/numbers';
import { emailRegex, validationMobile } from 'utils/helpers/validations';
import { useResponsive } from 'utils/hooks/useResponsive';

import { ShareIcon } from 'assets/icons';
import styles from '../../styles/invoice.module.scss';

interface ShareTicketForm {
  phoneNumber: string;
  email: string;
}

const Share = () => {
  const { isMobile } = useResponsive();
  const { replace, query } = useRouter();
  const { control, trigger, resetField } = useFormContext<ShareTicketForm>();

  const syncURLQueryParams = (name: string, value: string) => {
    if (value) {
      replace(
        {
          query: {
            ...query,
            [name]: value,
          },
        },
        undefined,
        { scroll: false },
      );
    } else if (value === '') {
      delete query[name];

      replace({ query }, undefined, { scroll: false });
    }
  };

  const resetInput = async (name: string) => {
    syncURLQueryParams(name, '');
    resetField(name as keyof ShareTicketForm, { defaultValue: '' });
    await trigger(name as keyof ShareTicketForm);
  };

  return (
    <div className={cn(styles.invoice__table, 'mx-auto mb-3')}>
      <div className={cn(styles.invoice__table__header, 'pe-3')}>
        <ShareIcon />
        <span className="pe-2">اطلاع رسانی سفر</span>
      </div>
      <div className={cn('mb-3 p-3', !isMobile && 'px-5 pt-3 pb-0')}>
        <span className={cn('text-2 d-flex', !isMobile && 'text-3')}>
          بلیط و اطلاع رسانی های بعد از خرید به این شماره موبایل و ایمیل ارسال می شود. در صورت نیاز
          اطلاعات زیر را ویرایش کنید.{' '}
        </span>
      </div>
      <div className={cn('px-3 px-md-5')}>
        <form className="d-lg-flex row">
          <Controller
            name="phoneNumber"
            rules={{
              required: 'شماره موبایل الزامی می باشد',
              validate: (value: string) => validationMobile(value) || 'شماره موبایل صحیح نمی‌باشد',
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
                  syncURLQueryParams(field.name, e.target.value);
                  field.onChange(toLatin(e.target.value));
                }}
              />
            )}
          />
          <Controller
            name="email"
            rules={{
              validate: (value) => {
                if (!value) {
                  return true;
                } else {
                  return emailRegex(value) || 'ایمیل وارد شده صحیح نمی‌باشد';
                }
              },
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
                  syncURLQueryParams(field.name, e.target.value);
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
