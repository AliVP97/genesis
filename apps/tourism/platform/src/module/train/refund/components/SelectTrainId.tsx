import { FC, FormEventHandler, useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import RadioElement from 'components/radio';
import { getOrderV2 } from 'services/train/orders';
import { useTrainRefundPath } from '../hooks';
import { Loader } from './Loader';
import { TComponentProps } from '.';

export const SelectTrainId: FC<TComponentProps> = ({ setAllowSubmit }) => {
  const { orderId, push } = useTrainRefundPath();

  const {
    data: orderData,
    error,
    isFetching,
    isError,
    refetch,
  } = useQuery(['train-order', orderId], getOrderV2, {
    staleTime: Infinity,
    retry: false,
  });

  const [trainId, setTrainId] = useState(orderData?.trips?.[0]?.trainInfo?.trainId);

  const onChange = (value: string) => {
    setTrainId(value);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    push({ trainId });

    setAllowSubmit(false);
  };

  useEffect(() => {
    if (trainId) {
      setAllowSubmit(true);
    }
  }, [!!trainId]);

  useEffect(() => {
    if (orderData) {
      setTrainId(orderData?.trips?.[0]?.trainInfo?.trainId);
    }
  }, [orderData]);

  return (
    <Loader {...{ isFetching, isError, error, refetch }}>
      <form
        id="train-refund"
        className="d-flex align-items-start flex-column h-100 w-100"
        onSubmit={onSubmit}
      >
        <span className="d-inline-block mt-3 text-3">
          لطفا مسیر سفر را برای استرداد انتخاب کنید{' '}
        </span>
        <div className="mx-4">
          {orderData?.trips?.[0]?.trainInfo?.trainId && (
            <RadioElement
              label={`سفر رفت : ${orderData.trips[0].trainInfo?.originName} - ${orderData.trips[0].trainInfo?.destinationName}`}
              onChange={onChange}
              value={orderData.trips[0].trainInfo?.trainId}
              checked={trainId === orderData.trips[0].trainInfo?.trainId}
            />
          )}
          {orderData?.trips?.[1]?.trainInfo?.trainId && (
            <RadioElement
              label={`سفر برگشت : ${orderData.trips[1].trainInfo?.originName} - ${orderData.trips[1].trainInfo?.destinationName}`}
              onChange={onChange}
              value={orderData.trips[1].trainInfo?.trainId}
              checked={trainId === orderData.trips[1].trainInfo?.trainId}
            />
          )}
        </div>
      </form>
    </Loader>
  );
};
