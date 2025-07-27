import { captureMessage } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { TLoginSSo } from 'pages/login/sso';
import { useEffect } from 'react';
import { useGetSSOValidation, useMutationSSO } from 'services/sso';
import { encryptTokens } from 'utils/helpers/tokens';

export type TAuthTokenResponse = { token: string; refresh_token: string };

type StorageDataProps = {
  UATP: string;
  UFTP: string;
  original_platform: string;
  platform: string;
};

const useLoginSSO = (info: TLoginSSo) => {
  const { query, push } = useRouter();
  const { asPath } = useRouter();

  useEffect(() => {
    if (!query.redirect) {
      push('/');
    }
  }, []);

  const uuid = query.otp as string;
  const originalPlatform = query.platform as string;
  const isNewSSOFlow = Boolean(uuid && originalPlatform);

  const targetPath = query.redirect;
  const origin = query.origin;

  const storageDataHandler = (storageData: StorageDataProps) => {
    localStorage.setItem('UATP', storageData.UATP);
    localStorage.setItem('UFTP', encryptTokens(storageData.UFTP));
    localStorage.setItem('original_platform', storageData.original_platform);
    sessionStorage.setItem('platform', storageData.platform);
  };

  const handleGetSSOSuccess = (ssoValidationData: { data: { active: boolean } }) => {
    if ((ssoValidationData?.data as { active: boolean }).active) {
      const authSplitter = info.authorization.split(' ');
      const authToken = authSplitter.length > 1 ? authSplitter[1] : authSplitter[0];
      const storageData = {
        UATP: authToken,
        UFTP: info.token,
        original_platform: info.platform,
        platform: info.platform,
      };
      storageDataHandler(storageData);
      window.location.href = `${origin}/${targetPath}`;
    }
  };

  const handleGetSSOError = () => {
    window.location.href = `${origin}/${targetPath}`;
  };

  useGetSSOValidation(isNewSSOFlow, info.authorization, handleGetSSOSuccess, handleGetSSOError);

  const handleAuthTokenSuccess = (res: TAuthTokenResponse) => {
    const storageData = {
      UATP: res.token,
      UFTP: res.refresh_token,
      original_platform: originalPlatform,
      platform: originalPlatform,
    };
    storageDataHandler(storageData);
    captureMessage(asPath);
    window.location.href = `${origin}/${targetPath}`;
  };

  const handleAuthTokenError = () => {
    window.location.href = `${origin}/${targetPath}`;
  };

  const { authTokenMutate } = useMutationSSO(handleAuthTokenSuccess, handleAuthTokenError);

  useEffect(() => {
    if (isNewSSOFlow && query.redirect) {
      authTokenMutate();
    } else {
    }
  }, []);
};

export default useLoginSSO;
