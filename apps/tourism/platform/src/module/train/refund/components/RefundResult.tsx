import { FC, FormEventHandler } from 'react';

import { useQuery } from 'react-query';

import { refund } from 'services/train/refund';
import { useTrainRefundPath } from '../hooks';
import { Loader } from './Loader';
import { TComponentProps } from '.';

export const RefundResult: FC<TComponentProps> = ({ setAllowSubmit }) => {
  const { orderId, trainId, ticketIds, confirmResult } = useTrainRefundPath();

  const { data, error, isFetching, isError, refetch } = useQuery(
    ['train-refund', orderId, trainId, ticketIds],
    () => ticketIds && refund(orderId, trainId, ticketIds),
    {
      onSuccess: () => {
        setAllowSubmit(true);
      },
      retry: false,
      staleTime: Infinity,
    },
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    confirmResult();
  };

  return (
    <form id="train-refund" onSubmit={onSubmit}>
      <Loader {...{ isFetching, isError, error, refetch }}>
        <div>{data?.message}</div>
      </Loader>
    </form>
  );
};
