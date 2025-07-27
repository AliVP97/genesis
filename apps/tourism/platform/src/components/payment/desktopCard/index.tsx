import React, { Dispatch, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { PaymentMethodsIcon } from 'assets/icons';
import styles from './paymentMethods.module.scss';
import PaymentItem from './PaymentItem';
import { TGatewayTypeInfo } from '..';
import { useGateways } from '../hooks/useGateways';
import Spinner from 'components/spinner';
import { useTourPrice } from '../../../module/tour/checkout/hooks/useTourPrice';
import { FieldValues, UseFormGetValues } from 'react-hook-form';
import { TPackageItem } from 'services/tour/register/interface';
import { TTourGetCheckoutResponse } from '../../../services/tour/v2/checkout/type';
type PaymentMethods = {
  serviceId?: number;
  setGatewayId?: Dispatch<React.SetStateAction<number | undefined>>;
  data?: TPackageItem;
  getValues?: UseFormGetValues<FieldValues>;
};
export type TPaymentMethod = {
  id: number;
  paymentType: string;
  paymentMethod: string;
};
const PaymentMethods = (props: PaymentMethods) => {
  const { serviceId, setGatewayId, data, getValues } = props;
  const { totalSum } = useTourPrice(
    data as TTourGetCheckoutResponse,
    getValues as UseFormGetValues<FieldValues>,
    serviceId as number,
  );
  const platform = useMemo(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('platform');
    }
  }, []);
  const [gatewayTypeInfo, setGatewayTypeInfo] = useState<TGatewayTypeInfo>();
  const stableTotalSum = useMemo(() => totalSum, [totalSum]);
  const { paymentMethodData, paymentMethodLoading } = useGateways(
    serviceId,
    Boolean(serviceId),
    undefined,
    stableTotalSum,
  );
  const handleChangeGateway = (method: TPaymentMethod) => {
    setGatewayTypeInfo({
      id: method?.id,
      gatewayType: method.paymentType,
      gatewayMethod: method.paymentMethod,
    });
    setGatewayId && setGatewayId(method?.id);
  };
  useEffect(() => {
    // If gateway is only on item should set that item to default
    if (paymentMethodData?.data) {
      if (platform !== 'superapp' && paymentMethodData.data[0]?.paymentMethod === 'mpg') {
        setGatewayTypeInfo({
          id: paymentMethodData.data[1]?.id,
          gatewayType: paymentMethodData.data[1]?.paymentType,
          gatewayMethod: paymentMethodData.data[1]?.paymentMethod,
        });
        setGatewayId && setGatewayId(paymentMethodData.data[1]?.id);
      } else if (
        platform === 'superapp' &&
        paymentMethodData.data[0]?.paymentMethod === 'ipg' &&
        paymentMethodData.data[0]?.id !== 5
      ) {
        setGatewayTypeInfo({
          id: paymentMethodData.data[1]?.id,
          gatewayType: paymentMethodData.data[1]?.paymentType,
          gatewayMethod: paymentMethodData.data[1]?.paymentMethod,
        });
        setGatewayId && setGatewayId(paymentMethodData.data[1]?.id);
      } else {
        setGatewayTypeInfo({
          id: paymentMethodData.data[0]?.id,
          gatewayType: paymentMethodData.data[0]?.paymentType,
          gatewayMethod: paymentMethodData.data[0]?.paymentMethod,
        });
        setGatewayId && setGatewayId(paymentMethodData.data[0]?.id);
      }
    }
  }, [paymentMethodData]);
  return (
    <div className={styles.payment}>
      <div className={cn(styles.payment_table, 'mx-auto', 'mb-3')}>
        <div
          className={cn(
            styles.payment__table__header,
            'd-flex align-items-center  color-grey-1 text-weight-500 pe-3',
          )}
        >
          <PaymentMethodsIcon />
          <span className="pe-2 color-black">انتخاب روش پرداخت</span>
        </div>
      </div>
      <div className={styles.payment__items}>
        {paymentMethodLoading || !gatewayTypeInfo ? (
          <Spinner />
        ) : (
          paymentMethodData?.data?.map((item) => {
            if (item.id === 2) {
              return;
            }
            return (
              <PaymentItem
                key={item.id}
                id={item.id}
                selected={gatewayTypeInfo.id === item.id}
                methodName={item.name}
                label={item?.label as string}
                value={item}
                onChange={handleChangeGateway}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
