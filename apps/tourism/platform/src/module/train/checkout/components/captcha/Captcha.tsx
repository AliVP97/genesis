import { useEffect } from 'react';
import Image from 'next/image';
import { Controller, useFormContext } from 'react-hook-form';

import Input from 'components/input';
import Spinner from 'components/spinner';
import { toLatin } from 'utils/helpers/numbers';
import { useCaptcha } from './useCaptcha';

import { ArrowsRotate, ShieldCheck } from 'assets/icons';
import styles from './Captcha.module.scss';

export const Captcha = () => {
  const { data, refetch, isFetching } = useCaptcha();

  const { register, control, resetField } = useFormContext();

  useEffect(() => {
    if (data?.captchaId) {
      resetField('captchaId', { defaultValue: data.captchaId });
      resetField('captchaText', { defaultValue: '' });
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <ShieldCheck />
        <span>کد امنیتی</span>
      </div>
      <div className={styles.container__title}>لطفا کد داخل تصویر را وارد کنید.</div>
      <div className={styles.container__fieldset}>
        <input type="hidden" {...register('captchaId', { value: data?.captchaId })} />
        <Controller
          name="captchaText"
          rules={{
            required: 'کد امنیتی را وارد کنید.',
          }}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              field={field}
              clearInput={() => {
                resetField(field.name, { defaultValue: '' });
              }}
              isError={!!error}
              label="کد امنیتی"
              errorText={error?.message}
              className="col-lg-3 col-md-6"
              handleChange={(e) => field.onChange(toLatin(e.target.value))}
            />
          )}
        />
        <div className={styles.container__fieldset__refresh} onClick={() => refetch()}>
          <ArrowsRotate />
        </div>
        <div className={styles['container__image-container']}>
          {data?.image ? (
            <Image
              src={`data:image/png;base64, ${data?.image}`}
              alt="captcha"
              width={120}
              height={60}
            />
          ) : (
            <div className={styles['container__image-container__spinner-backdrop']}>
              <div className={styles['container__image-container__fallback']}>
                خطا در دریافت تصویر
              </div>
            </div>
          )}
          {isFetching && (
            <div className={styles['container__image-container__spinner-backdrop']}>
              <Spinner className={styles['container__image-container__spinner']} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
