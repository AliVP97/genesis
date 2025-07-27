import CryptoJS from 'crypto-js';

export const encryptTokens = (data: string | Record<string, unknown>) => {
  return CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(
      CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.NEXT_PUBLIC_UATP_KEY as string,
      ).toString(),
    ),
  );
};

export const decryptTokens = (token: string) => {
  try {
    if (!token) return;
    const decData = CryptoJS.enc.Base64.parse(token)?.toString(CryptoJS.enc.Utf8);
    const bytes = CryptoJS.AES.decrypt(
      decData,
      process.env.NEXT_PUBLIC_UATP_KEY as string,
    )?.toString(CryptoJS.enc.Utf8);
    return JSON.parse(bytes);
  } catch (err) {
    return token;
  }
};

export const jwtParsToken = (jwtToken: string) => {
  function base64UrlDecode(str: string) {
    // Convert Base64Url to Base64 by replacing '-' with '+' and '_' with '/'
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

  function decodeJwt(token: string) {
    const [header, payload] = token.split('.');
    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return { header: decodedHeader, payload: decodedPayload };
  }

  return decodeJwt(jwtToken);
};

export const encryptString = (item: string) => {
  return CryptoJS.AES.encrypt(item, process.env.NEXT_PUBLIC_STR_KEY as string)?.toString();
};

export const decryptString = (item: string) => {
  return CryptoJS.AES.decrypt(item, process.env.NEXT_PUBLIC_STR_KEY as string)?.toString(
    CryptoJS?.enc?.Utf8,
  );
};
