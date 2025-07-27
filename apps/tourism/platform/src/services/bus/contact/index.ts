import request from 'services/axios';
import API from 'utils/routes/api';
import { IUpdateContactInfoPayload } from '../order/interface';

export const updateOrderBusContactInfo = async (payload: IUpdateContactInfoPayload) => {
  const { data }: { data: Record<string, never> } = await request.post(
    `${API.BUS.UPDATE_CONTACT_INFO}`,
    { ...payload },
  );
  return data;
};
