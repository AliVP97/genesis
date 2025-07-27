import { ContactInfoRequest } from './interface';
import API from 'utils/routes/api';
import request from 'services/axios';

export const contactInfo = async (
  payload: ContactInfoRequest['parameters']['body']['body'] & { orderId: string },
) => {
  const { data }: { data: Record<string, never> } = await request.post(
    `${API.root}rajatrain/v1/orders/${payload.orderId}/contactinfo`,
    { phoneNumber: payload.phoneNumber, email: payload.email },
  );
  return data;
};
