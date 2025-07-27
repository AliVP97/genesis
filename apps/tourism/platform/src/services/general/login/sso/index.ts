import request from 'services/axios';
import API from 'utils/routes/api';

type AuthResponse = {
  token: string;
  refresh_token: string;
};

export const ssoValidation = async (authorization: string) => {
  return request.get(API.SSO_LOGIN.SSO_VALIDATION, {
    headers: {
      Authorization: authorization,
    },
  });
};

export const getAuthToken = async (otp: string): Promise<AuthResponse> => {
  const res = await request.post(
    API.SSO_LOGIN.GET_AUTH_TOKEN,
    {
      otp: otp,
    },
    {
      headers: {
        'api-key': process.env.NEXT_PUBLIC_API_KEY as string,
      },
    },
  );
  return res.data;
};
