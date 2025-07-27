export interface ConfirmRequest {
  phonNumber: string;
  code: string;
  headers: {
    mobile_no: string;
  };
}
export type ConfirmResponse = {
  access_token: string;
  refresh_token: string;
  sign_token: string;
  register_timestamp: string;
  access_expire_time: number;
};

export type RegisterResponse = {
  exp: number;
  len: number;
};

export interface tokenType {
  recivedCode: { code: string };
  option: {
    headers: {
      mobile_no: string;
    };
  };
}

export interface authType {
  headers: {
    mobile_no: string;
    client: 'web';
  };
}

export interface refreshType {
  refresh_token: string;
}

export type TLogout = {
  access_token: string;
};
