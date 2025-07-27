import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { DiscountInput } from 'components/discountInput';
import Spinner from 'components/spinner';

import { DiscountIcon } from 'assets/icons';
import styles from './discount.module.scss';
import { TDiscountProps } from './types/discountTypes';

const Discount: FC<TDiscountProps> = ({
  hasActionOnPrice,
  formAlert,
  discountOrder,
  submitHandler,
  changeHandler,
  clearHandler,
  isDisabled,
  isLoading,
  message,
  isDisabledBtn,
  status,
}) => {
  const buttonText = useMemo(
    () => (status === 'applied' ? 'حذف کد تخفیف' : 'اعمال کد تخفیف'),
    [status],
  );

  return (
    <div className={cn(styles.invoice__table, 'mx-auto rtl')}>
      <div
        className={cn(
          styles.invoice__table__header,
          'd-flex align-items-center color-on-surface text-weight-500 pe-3',
        )}
      >
        <DiscountIcon />
        <span className="pe-2">کد تخفیف</span>
      </div>
      <div className="mb-3 px-5 py-3 col-12">
        <div>
          <span className="text-3">
            لطفا کد تخفیف خود را وارد کنید و دکمه «اعمال کد تخفیف» را بزنید تا روی مبلغ فاکتور شما
            اعمال شود.
          </span>
        </div>
        <form
          onSubmit={submitHandler}
          className="d-flex row justify-content-between my-0 pt-3 px-3"
        >
          <DiscountInput
            disabled={isDisabled}
            name="discountCode"
            defaultValue={discountOrder?.discount?.code}
            onChange={changeHandler}
            onClear={clearHandler}
            message={message}
            shouldHandleSubmit={false}
            className="w-25 p-0"
            status={status}
          />
          <button
            className={cn(
              styles.invoice__offCode__allowBtn,
              'col-6 mt-2',
              (isDisabledBtn || hasActionOnPrice) && styles.invoice__offCode__notAllowBtn,
            )}
            type="submit"
            disabled={isDisabledBtn || hasActionOnPrice}
          >
            {isLoading ? <Spinner /> : buttonText}
          </button>
        </form>
        {formAlert}
      </div>
    </div>
  );
};

export default Discount;
