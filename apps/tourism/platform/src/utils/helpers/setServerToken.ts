import { GetServerSidePropsContext } from 'next';

export const serverTokens = { accessToken: '', refreshToken: '' };

export const SetServerToken = (
  ctx: GetServerSidePropsContext,
  redirectUrl: string | undefined = '',
) => {
  serverTokens.accessToken = ctx.req.cookies['access_token'] || '';
  serverTokens.refreshToken = ctx.req.cookies['refresh_token'] || '';
  const hasToken: boolean = !!serverTokens.accessToken || !!serverTokens.refreshToken;

  const payload = {
    redirect: {
      permanent: false,
      destination: redirectUrl,
    },
  };
  return { hasToken, payload };
};
