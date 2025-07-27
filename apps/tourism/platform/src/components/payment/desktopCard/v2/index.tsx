import React, { Dispatch, FC, useEffect, useState } from 'react';
import cn from 'classnames';

import { TGateway } from 'components/DynamicGateways';
import Spinner from 'components/spinner';
import { TGatewayTypeInfo } from '../..';
import { useGateways } from '../../hooks/useGateways';
import PaymentItem from './PaymentItem';

import { PaymentMethodsIcon } from 'assets/icons';
import styles from '../paymentMethods.module.scss';

type TPaymentMethodsProps = {
  serviceId?: number;
  setGateway?: Dispatch<React.SetStateAction<TGateway | undefined>>;
};

/**
 * desktopCard V2 aims a refactor and migration to new payment module
 */

const PaymentMethods: FC<TPaymentMethodsProps> = (props) => {
  const { serviceId, setGateway } = props;
  const [gatewayTypeInfo, setGatewayTypeInfo] = useState<TGatewayTypeInfo>();
  const { paymentMethodData, paymentMethodLoading } = useGateways(serviceId, Boolean(serviceId));

  const handleChangeGateway = (method: TGateway) => {
    setGatewayTypeInfo({
      id: method?.id,
      gatewayType: method.paymentType,
      gatewayMethod: method.paymentMethod,
    });
    setGateway && setGateway(method);
  };

  useEffect(() => {
    // select first item as default gateway
    if (paymentMethodData?.data) {
      setGatewayTypeInfo({
        id: paymentMethodData.data[0]?.id,
        gatewayType: paymentMethodData.data[0]?.paymentType,
        gatewayMethod: paymentMethodData.data[0]?.paymentMethod,
      });
      setGateway && setGateway(paymentMethodData.data[0]);
    }
  }, [paymentMethodData]);

  return (
    <div className={styles['payment']}>
      <div className={cn(styles['payment_table'], 'mx-auto', 'mb-3')}>
        <div
          className={cn(
            styles['payment__table__header'],
            'd-flex align-items-center  color-grey-1 text-weight-500 pe-3',
          )}
        >
          <PaymentMethodsIcon />
          <span className="pe-2 color-black">انتخاب روش پرداخت</span>
        </div>
      </div>
      <div className={styles['payment__items']}>
        {paymentMethodLoading || !gatewayTypeInfo ? (
          <Spinner />
        ) : (
          paymentMethodData?.data?.map((item) => (
            <PaymentItem
              key={item.id}
              selected={gatewayTypeInfo.id === item.id}
              methodName={item.name}
              value={item}
              onChange={handleChangeGateway}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
