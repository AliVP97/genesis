import { useQuery } from 'react-query';
import request from 'services/axios';
import API from 'utils/routes/api';
import { GetOrderForRefundResponse } from '../types/api';

const getOrderForRefund = async (orderId: string) => {
  const { data } = await request.get<GetOrderForRefundResponse>(
    API.INTERNATIONALFLIGHT.GET_ORDER_FOR_REFUND + '/' + orderId,
  );

  return data;
};

const useGetOrderForRefund = (orderId: string) =>
  useQuery(['international-flight-get-order-for-refund', orderId], () =>
    getOrderForRefund(orderId),
  );

export default useGetOrderForRefund;
