import { GetServerSidePropsContext } from 'next';
import { setCookieSSR } from './coockieHelper';

export const authSetter = (ctx: GetServerSidePropsContext) => {
  const authData = {
    accessToken: ctx.req.cookies['access-token'],
    refreshToken: ctx.req.cookies['refresh-token'],
    website: ctx.req.cookies['website'],
  };

  if (authData?.website) {
    return true;
  }
  if (authData?.refreshToken) {
    setCookieSSR(ctx.req, ctx.res, 'access_token', authData.accessToken || '', {
      secure: false,
      httpOnly: false,
    });
    setCookieSSR(ctx.req, ctx.res, 'refresh_token', authData.refreshToken, {
      secure: false,
      httpOnly: false,
    });

    setCookieSSR(ctx.req, ctx.res, 'website', 'ACCEPT', {
      secure: false,
      httpOnly: false,
    });

    return true;
  }

  return false;
};
