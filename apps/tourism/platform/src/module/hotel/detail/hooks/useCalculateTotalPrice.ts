import { useMemo } from 'react';
import { TRoom } from './../../../../services/hotel/detail/interface';

const UseCalculateTotalPrice = (data: { [key: string]: Array<TRoom[]> }) => {
  const result = useMemo(() => {
    return Object.values(data)?.reduce(
      (prev, current) =>
        prev + current?.length * Number(current![0]![0]?.room?.priceDetail?.price?.totalPrice),
      0,
    );
  }, [data]);
  return { result };
};

export default UseCalculateTotalPrice;
