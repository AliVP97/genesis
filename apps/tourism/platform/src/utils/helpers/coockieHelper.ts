import Cookies, { SetOption } from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

export function setCookieSSR(
  req: IncomingMessage,
  res: ServerResponse,
  cookieName: string,
  cookieValue: string,
  options?: SetOption,
): void {
  const cookies = new Cookies(req, res);

  cookies.set(cookieName, cookieValue, options);
}

export const setCookie = (name: string, value: string, expire?: number) => {
  const domain = window.location.hostname;
  // const localDate = new Date(new Date().getTime() + Number(expire) * 1000);
  const localDate = new Date(Number(expire) * 1000);
  const expireTime = localDate.toUTCString();
  const expires = expire ? `; expires=${expireTime}` : '';
  document.cookie =
    name + '=' + (value || '') + expires + '; path=/;' + 'domain=' + '' + domain + ';';
};

export const getCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    const nameEQ = name + '=';
    const ca = document?.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
};

export const removeCookie = (name: string, path = '/', domain = window.location.hostname) => {
  if (getCookie(name)) {
    document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};
