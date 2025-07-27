import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getOrder } from 'services/hotel/orders';

const useGetOrder = () => {
  const { query } = useRouter();
  const { data: order, refetch } = useQuery(['order', query.id as string], getOrder, {
    cacheTime: 0,
    staleTime: 0,
  });
  return { order, refetch };
};

export default useGetOrder;
