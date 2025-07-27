import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const FALLBACK_PATH = {
  web: '/profile/travels',
  android: 'https://780.ir/home',
  ios: 'hafhashtad://tourism/',
};

export const getTrainRefundPath = (
  orderId?: string,
  tripId = '',
  ticketIds?: string[],
  isResultPage = false,
) => {
  const path = [
    'profile',
    'travels',
    'train',
    orderId,
    'refund',
    tripId,
    isResultPage ? 'result' : '',
  ];

  return orderId
    ? `/${path.join('/')}${ticketIds ? `?ticketIds=${ticketIds.join(',')}` : ''}`
    : FALLBACK_PATH.web;
};

export const useTrainRefundPath = () => {
  const queryClient = useQueryClient();
  const { query, push, replace } = useRouter();

  const [serviceName, orderId, actionName, trainId, isResultPage] = query.slug as string[];
  const ticketIds = (query.ticketIds as string | undefined)?.split(',');

  const goToPage = ({
    orderId: newOrderId,
    trainId: newTrainId,
    ticketIds: newTicketIds,
    isResultPage: newIsResultPage,
  }: {
    orderId?: string;
    trainId?: string;
    ticketIds?: string[];
    isResultPage?: boolean;
  }) => {
    push(
      getTrainRefundPath(
        newOrderId || orderId,
        newTrainId || trainId,
        newTicketIds || ticketIds,
        newIsResultPage || !!isResultPage,
      ),
    );
  };

  const confirmResult = () => {
    queryClient.invalidateQueries(['train-order', orderId]);

    const platform = sessionStorage.getItem('platform');

    if (platform && platform in FALLBACK_PATH) {
      window.location.href = FALLBACK_PATH[platform as keyof typeof FALLBACK_PATH];
    } else {
      push(FALLBACK_PATH.web);
    }
  };

  useEffect(() => {
    if (serviceName.toLowerCase() !== 'train' || actionName.toLowerCase() !== 'refund') {
      replace(FALLBACK_PATH.web);
    }
  }, [serviceName, actionName]);

  return {
    orderId,
    trainId,
    ticketIds,
    isResultPage: !!isResultPage,
    push: goToPage,
    confirmResult,
  };
};
