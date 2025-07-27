import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { notify } from 'utils/notification';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Button from 'components/button';
import ChanceCard from 'components/userChanceCard';
import { useGateways } from './hooks/useGateways';
import { PaymentMethodInfo } from './PaymentMethodInfo';
import { definitions } from 'types/payment';
import { AxiosError } from 'axios';
import { TGateway } from 'components/DynamicGateways';
type TPayment = {
  open: boolean;
  onDismiss: () => void;
  title: string;
  serviceId?: number;
  submitCallback?: () => void;
  module: string;
  children: ReactNode;
  subServiceId?: string;
  price: string | number | undefined;
  setGateway?: Dispatch<SetStateAction<TGateway | undefined>>;
  setGatewayId?: (id: number) => void;
  isLoading: boolean;
  reservePriceChange?: boolean;
};

export type TGatewayTypeInfo = {
  id: number;
  gatewayType: string;
  gatewayMethod: string;
};
export type TPaymentGateway = definitions['apipaymentGateway'][] | undefined;
export type TPaymentMethod = {
  id: number;
  paymentType: string;
  paymentMethod: string;
};

export type TOrderRes = {
  serviceId: number | string;
  orderId: string;
  price?: number | string;
};

export const Payment = ({
  open,
  onDismiss,
  title,
  children,
  serviceId,
  submitCallback,
  subServiceId,
  price,
  setGateway,
  setGatewayId,
  isLoading,
  reservePriceChange,
}: TPayment) => {
  const { paymentMethodData, paymentMethodLoading } = useGateways(
    serviceId,
    open,
    subServiceId,
    price as number,
  );
  // const {walletMethod, isLoadingWalletMethod, isLoadingMPGMethod} =

  const [gatewayTypeInfo, setGatewayTypeInfo] = useState<TGatewayTypeInfo>();
  const [loading, setLoading] = useState(false);
  const handleClickPayment = async () => {
    try {
      if (!submitCallback) {
        return;
      }
      setLoading(true);
      submitCallback();
    } catch (err) {
      notify({
        type: 'error',
        message:
          ((err as AxiosError).response?.data as { message: string })?.message ||
          'با عرض پوزش در فرایند رزرو شما مشکلی پیش آمده لطفا مجددا اقدام فرمایید',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeGateway = (gatewayData: TGateway) => {
    setGatewayTypeInfo({
      id: gatewayData?.id,
      gatewayType: gatewayData.paymentType,
      gatewayMethod: gatewayData.paymentMethod,
    });
    setGateway?.(gatewayData);
    setGatewayId?.(gatewayData?.id);
  };

  const lastValidDataRef = useRef({ id: 0, paymentType: '', paymentMethod: '' } as TPaymentMethod);

  useEffect(() => {
    if (paymentMethodData?.data) {
      const currentFirstItem = paymentMethodData.data[0];

      // Skip if the data is the same as last time
      if (
        lastValidDataRef.current?.id === currentFirstItem?.id &&
        lastValidDataRef.current?.paymentType === currentFirstItem?.paymentType &&
        lastValidDataRef.current?.paymentMethod === currentFirstItem?.paymentMethod
      ) {
        return; // No changes, skip effect
      }

      // Update ref and state only if data is different
      lastValidDataRef.current = currentFirstItem;

      setGatewayTypeInfo({
        id: currentFirstItem?.id,
        gatewayType: currentFirstItem?.paymentType,
        gatewayMethod: currentFirstItem?.paymentMethod,
      });

      setGateway?.(currentFirstItem);
    }
  }, [
    paymentMethodData?.data?.[0]?.id,
    paymentMethodData?.data?.[0]?.paymentType,
    paymentMethodData?.data?.[0]?.paymentMethod,
  ]);

  return (
    <BottomSheet
      blocking={!reservePriceChange}
      open={open}
      onDismiss={onDismiss}
      header={title}
      footer={
        <Button
          radius
          btnType="button"
          onClick={handleClickPayment}
          loading={loading || paymentMethodLoading || isLoading}
          className="btn btn-primary d-block w-100"
          disabled={!paymentMethodData?.data.length || isLoading}
        >
          تایید
        </Button>
      }
    >
      <div dir="rtl" className="p-4">
        <ChanceCard
          price={String(price)}
          serviceIdProps={!!serviceId ? String(serviceId) : undefined}
        />
        {children}
        {gatewayTypeInfo && (
          <PaymentMethodInfo
            paymentMethodLoading={paymentMethodLoading}
            onChange={handleChangeGateway}
            paymentMethodData={paymentMethodData}
            gatewayInfo={gatewayTypeInfo}
          />
        )}
      </div>
    </BottomSheet>
  );
};
