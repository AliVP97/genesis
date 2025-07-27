import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { getOrderV2 } from 'services/internationalFlight/order';
export const useGetInternationalFlightOrder = () => {
  const { query } = useRouter();
  const { data: orderData, isLoading } = useQuery(['order', query.id as string], getOrderV2);
  return { orderData, isLoading };
};
