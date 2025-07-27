import request from 'services/axios';
import API from 'utils/routes/api';
import { ConfirmRefundRequest, ConfirmRefundResponse } from '../types/api';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

const confirmRefund = async (payload: ConfirmRefundRequest) => {
  const { data } = (await request.post(
    API.INTERNATIONALFLIGHT.CONFIRM_REFUND,
    payload,
  )) as AxiosResponse<ConfirmRefundResponse>;

  return data;
};

const useConfirmRefund = () =>
  useMutation<ConfirmRefundResponse, Error, ConfirmRefundRequest>({
    mutationFn: confirmRefund,
  });

export default useConfirmRefund;
