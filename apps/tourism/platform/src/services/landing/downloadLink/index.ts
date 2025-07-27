import request from 'services/axios';
import API from 'utils/routes/api';

export const sendLink = async (phoneNumber: string, device: string) => {
  const { data } = await request.post(API.SEND_DOWNLOAD_LINK, {
    mobile: phoneNumber,
    device: device,
  });
  return data;
};
