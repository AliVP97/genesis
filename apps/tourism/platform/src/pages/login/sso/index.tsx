import { GetServerSideProps } from 'next';
import LoginSSOContainer from 'containers/sso';

export type TLoginSSo = {
  authorization: string;
  platform: string;
  token: string;
};

export default function LoginSSO({ authorization, platform, token }: TLoginSSo) {
  const SSOHeaderInfo = {
    authorization,
    platform,
    token,
  };

  return <LoginSSOContainer SSOHeaderInfo={SSOHeaderInfo} />;
}

LoginSSO.layout = 'empty';

export const getServerSideProps: GetServerSideProps = (context) => {
  return new Promise((resolve) => {
    const { authorization, token, platform } = context.req.headers;
    if (authorization && token && platform) {
      resolve({
        props: {
          authorization,
          platform,
          token,
        },
      });
    } else {
      resolve({
        props: {},
      });
    }
  });
};
