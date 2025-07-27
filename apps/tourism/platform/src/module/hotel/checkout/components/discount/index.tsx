import React, { useState } from 'react';
import styles from '../../styles/invoice.module.scss';
import { DiscountIcon } from 'assets/icons';
import cn from 'classnames';
import Input from 'components/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { CheckoutFormProps } from 'module/flights/passengers/tabSelect/interface';

const InvoiceDiscount = () => {
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
    <div className={cn(styles['invoice__table'], 'mx-auto')}>
      <div
        className={cn(
          styles['invoice__table__header'],
          'd-flex align-items-center color-grey-1 text-weight-500 pe-3',
        )}
      >
        <DiscountIcon />
        <span className="pe-2 color-black">کد تخفیف</span>
      </div>
      <div className="mb-3 px-5 py-3 col-12">
        <div>
          <span className="text-3">
            لطفا کد تخفیف خود را وارد کنید و دکمه «اعمال کد تخفیف» را بزنید تا روی مبلغ فاکتور شما
            اعمال شود.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex row justify-content-between my-0 pt-3 align-items-center px-3"
        >
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
                suffixClassName={styles['invoice__offCode__suffix']}
                className="w-25 p-0"
                handleChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <button className={cn(styles['invoice__offCode__btn'], 'col-6')} type="submit">
            اعمال کد تخفیف{' '}
          </button>
        </form>
        {offCode != '' && (
          <span className="color-red text-2 d-flex align-items-center justify-content-center">
            کد تخفیف وارد شده صحیح نمی باشد
          </span>
        )}
      </div>
    </div>
  );
};

export default InvoiceDiscount;
