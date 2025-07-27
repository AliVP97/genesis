import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getOrderV2 } from 'services/internationalFlight/order';

const useGetOrder = () => {
  const { query } = useRouter();
  const { data: order, refetch: refetchOrder } = useQuery(
    ['order', query.id as string],
    getOrderV2,
    { cacheTime: 0 },
  );
  return { order, refetchOrder };
};

export default useGetOrder;
