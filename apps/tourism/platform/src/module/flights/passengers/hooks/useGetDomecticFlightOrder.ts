import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { getOrder } from 'services/domestic/flight';

export const useGetDomesticFlightOrder = () => {
  const { query } = useRouter();
  const { data: orderData, isLoading } = useQuery(['order', query.id as string], getOrder);
  return { orderData, isLoading };
};
