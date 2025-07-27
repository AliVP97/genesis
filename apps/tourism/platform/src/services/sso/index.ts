import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { getAuthToken, ssoValidation } from 'services/general/login/sso';
import { TAuthTokenResponse } from 'containers/sso/hooks/useLoginSSO';

export const useGetSSOValidation = (
  isNewSSOFlow: boolean,
  authorization: string,
  onSuccess: (data: { data: { active: boolean } }) => void,
  onError: () => void,
) => {
  const { query } = useRouter();
  return useQuery({
    queryKey: ['ssoValidation'],
    queryFn: () => ssoValidation(authorization),
    enabled: !isNewSSOFlow && Boolean(query.redirect),
    retry: 1,
    onSuccess,
    onError,
  });
};

export const useMutationSSO = (
  handleSuccess: (res: TAuthTokenResponse) => void,
  handleError: () => void,
) => {
  const { query } = useRouter();
  const uuid = query.otp as string;
  const { data: authTokenData, mutate: authTokenMutate } = useMutation({
    mutationFn: () => getAuthToken(uuid),
    onSuccess: (res) => handleSuccess(res),
    onError: () => handleError(),
  });
  return {
    authTokenMutate,
    authTokenData,
  };
};
