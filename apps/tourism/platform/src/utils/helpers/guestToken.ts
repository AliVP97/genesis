import { getGuestToken } from '../../services/general/login/guestLogin';
import { getCookie, setCookie, setCookieSSR } from './coockieHelper';
import { GetServerSidePropsContext } from 'next';
import { authSetter } from './authSetter';
import { decryptTokens } from './tokens';

export const guestToken = async (context?: GetServerSidePropsContext) => {
  if (context) {
    if (authSetter(context)) {
      return true;
    }
  }

  const refGuestToken = context
    ? context.req.cookies['refGuest_token']
    : getCookie('refGuest_token');
  const refreshToken = context
    ? context.req.cookies['refresh_token']
    : decryptTokens(localStorage.getItem('UFTP') as string);

  let isLogin = !!refreshToken || !!refGuestToken;

  if (!refGuestToken && !refreshToken) {
    const guestUser = await getGuestToken();

    if (context) {
      setCookieSSR(context.req, context.res, 'guest_token', guestUser.access_token, {
        secure: false,
        httpOnly: false,
      });
      setCookieSSR(context.req, context.res, 'refGuest_token', guestUser.refresh_token, {
        secure: false,
        httpOnly: false,
      });
    } else {
      setCookie('guest_token', guestUser.access_token);
      setCookie('refGuest_token', guestUser.refresh_token);
    }

    isLogin = !!guestUser.access_token;
  }
  return isLogin;
};
