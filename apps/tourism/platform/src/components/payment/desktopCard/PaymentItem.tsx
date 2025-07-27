import React from 'react';
import styles from './paymentMethods.module.scss';
import RadioElement from 'components/radio';
import cn from 'classnames';
import { TGateway } from 'components/DynamicGateways';
import { TPaymentMethod } from '..';
import { SnappPayIcon } from 'assets/icons';
type PaymentItemProps = {
  selected?: boolean;
  methodName?: string;
  remainAmount?: string;
  value: TGateway;
  onChange: (method: TPaymentMethod) => void;
  id: number;
  label: string;
};
const PaymentItem = (props: PaymentItemProps) => {
  const { selected, methodName, label, value, onChange, id } = props;
  const shouldRenderSnappPay = id === 6;
  return (
    <div className={cn(styles['payment__item'], selected && styles['payment__item--selected'])}>
      <RadioElement
        value={value}
        className="text-3"
        checked={Boolean(selected)}
        label={''}
        onChange={onChange}
      />
      {shouldRenderSnappPay && (
        <div className="d-flex flex-row">
          <SnappPayIcon />
        </div>
      )}
      <div className="d-flex flex-column align-items-center ">
        <div className="px-2 align-self-start">{methodName}</div>

        {label && <div className="px-2  fs-2">{label}</div>}
        {value.paymentType === 'wallet' && (
          <div className="px-2 text-2 text-weight-400 color-grey-24 pt-2 d-flex">
            موجودی: {value.balance?.length ? value.balance : 0} <br />
            {value.expireDate?.length ? `انقضاء: ${value.expireDate}` : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentItem;
