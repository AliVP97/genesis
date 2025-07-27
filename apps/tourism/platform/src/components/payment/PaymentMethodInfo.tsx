import React, { useMemo } from 'react';
import { PaymentMethodSkeleton } from './PaymentMethodSkeleton';
import { Chevron, PayIcon, WalletIco } from 'assets/icons';
import { TGatewayTypeInfo } from '.';
import { GateWaysResponse } from 'services/domestic/flight/interface';
import { TGateway } from 'components/DynamicGateways';

export type TPaymentMethodInfo = {
  paymentMethodData?: GateWaysResponse;
  paymentMethodLoading: boolean;
  gatewayInfo: Pick<TGatewayTypeInfo, 'id'>;
  onChange: (method: TGateway) => void;
};
export const PaymentMethodInfo = ({
  paymentMethodData,
  paymentMethodLoading,
  gatewayInfo,
  onChange,
}: TPaymentMethodInfo) => {
  const platform = useMemo(() => {
    return sessionStorage.getItem('platform');
  }, []);

  if (paymentMethodLoading) {
    return <PaymentMethodSkeleton />;
  }

  return (
    <>
      {paymentMethodData?.data?.map((method) => {
        const shouldRenderSnappPay = method?.id === 6;

        if (platform !== 'superapp' && method.paymentMethod === 'mpg') {
          return;
        } else if (platform === 'superapp' && method?.id === 3) {
          return;
        }
        return (
          <div key={method?.id}>
            <label
              className={`d-flex align-items-center justify-content-center p-3 general-box-shadow mt-4 mb-3 rounded-4 border ${
                gatewayInfo.id === method?.id && 'border-primary'
              }`}
              htmlFor={`${method?.id}`}
            >
              {shouldRenderSnappPay ? (
                <div>
                  <PayIcon />
                </div>
              ) : (
                <WalletIco style={{ fill: '#9e9e9e', alignSelf: 'baseline' }} />
              )}
              <div className="d-flex flex-column me-3 flex-grow-1">
                <span className="fs-3 text-weight-500 mb-1">{method?.name}</span>
                {method.paymentType == 'wallet' ? (
                  <span className="text-2 text-weight-400 color-grey-24 pt-2">
                    موجودی: {method.balance?.length ? method.balance : 0} <br />{' '}
                    {method.expireDate?.length ? `انقضاء: ${method.expireDate}` : null}
                  </span>
                ) : (
                  <span className="fs-2 color-success">{method?.label}</span>
                )}
              </div>
              <Chevron style={{ transform: 'rotate(180deg)' }} />
            </label>
            <input
              name="payType"
              onChange={() => {
                onChange(method);
              }}
              defaultChecked={paymentMethodData?.data?.length === 1}
              id={`${method?.id}`}
              value={method?.id}
              type="radio"
              className="d-none"
            />
          </div>
        );
      })}
    </>
  );
};
