import React from 'react';

import cn from 'classnames';

import RadioElement from 'components/radio';
import { TGateway } from 'components/DynamicGateways';

import styles from '../paymentMethods.module.scss';

type PaymentItemProps = {
  selected?: boolean;
  methodName?: string;
  remainAmount?: string;
  value: TGateway;
  onChange: (method: TGateway) => void;
};

const PaymentItem = (props: PaymentItemProps) => {
  const { selected, methodName, value, onChange } = props;

  return (
    <div
      className={cn(styles.payment__item, selected && styles['payment__item--selected'])}
      onClick={() => onChange(value)}
    >
      <RadioElement
        value={value}
        className="text-3"
        checked={Boolean(selected)}
        label={''}
        onChange={onChange}
      />
      <div className="d-flex flex-column align-items-center ">
        <div className="px-2 align-self-base-line">{methodName}</div>
        {value.paymentType === 'wallet' && (
          <div className="text-2 text-weight-400 color-grey-24 pt-2">
            موجودی: {value.balance?.length ? value.balance : 0} <br />
            {value.expireDate?.length ? `انقضاء: ${value.expireDate}` : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentItem;
