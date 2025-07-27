import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getGateways } from 'services/general/payment';
import { definitions } from 'types/payment';

export type TPaymentGatewayInfo = Omit<definitions['apipaymentGateway'], 'label' | 'name' | 'fee'>;
type TUseGateways = {
  id?: number;
  enabled: boolean;
  subServiceId?: string;
  totalSum?: number;
};

export const useGateways = (
  id: TUseGateways['id'],
  enabled: TUseGateways['enabled'],
  subServiceId?: TUseGateways['subServiceId'],
  totalSum?: TUseGateways['totalSum'],
) => {
  const serviceId = typeof window !== 'undefined' && sessionStorage.getItem('serviceId');
  const [gatewayTypeInfo, setGatewayTypeInfo] = useState<TPaymentGatewayInfo>({
    id: 2,
    paymentMethod: 'direct',
    paymentType: 'mpg',
  });

  const {
    data: paymentMethodData,
    isLoading: paymentMethodLoading,
    refetch,
  } = useQuery(
    ['paymentMethod', id ?? serviceId, subServiceId, totalSum],
    () => getGateways({ serviceId: id as number, totalSum: totalSum as number }),
    {
      enabled: enabled || totalSum !== undefined,
      staleTime: 60000,
    },
  );
  useEffect(() => {
    if (totalSum) {
      refetch(); // Trigger refetch when totalSum changes
    }
  }, [totalSum, refetch]);
  return {
    paymentMethodData,
    paymentMethodLoading,
    gatewayTypeInfo,
    setGatewayTypeInfo,
  };
};
