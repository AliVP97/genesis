import request from 'services/axios';
import API from 'utils/routes/api';
import {
  ConfirmRequest,
  ConfirmResponse,
  refreshType,
  RegisterResponse,
  tokenType,
} from './interface';

export type LoginError = {
  data: {
    message: string;
  };
};

export const register = async (phoneNumber: string) => {
  const { data }: { data: RegisterResponse } = await request.post(API.AUTH_REGISTER, null, {
    headers: {
      mobile_no: phoneNumber,
      'api-key':
        sessionStorage.platform === 'superapp'
          ? 'qshpGbwoYHOk59IPNW0RNC6nThE='
          : 'SiAc_e1y8z1ZYJDlZlyPBOKa4xU=',
      client: 'web',
    },
  });
  return data;
};

export const confirm = async (option: ConfirmRequest) => {
  const { data }: { data: ConfirmResponse } = await request.post(
    API.AUTH_TOKEN,
    { code: option.code },
    {
      headers: {
        mobile_no: option.phonNumber,
        'api-key':
          sessionStorage.platform === 'superapp'
            ? 'qshpGbwoYHOk59IPNW0RNC6nThE='
            : 'SiAc_e1y8z1ZYJDlZlyPBOKa4xU=',
        client: 'web',
      },
    },
  );
  return data;
};

export const getToken = async (formData: tokenType) => {
  const { data } = await request.post(API.AUTH_TOKEN, formData.recivedCode, formData.option);
  return data;
};

export const refreshToken = async (body: refreshType) => {
  const { data } = await request.post('authserver/refreshtoken', body);
  return data;
};

export const logout = async (body: string) => {
  const { data } = await request.post('authserver/logout', body, {
    headers: { Authorization: `Bearer ${body}` },
  });
  return data;
};
