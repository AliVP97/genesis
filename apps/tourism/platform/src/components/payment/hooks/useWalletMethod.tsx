import { useQuery } from 'react-query';
import { getWalletAmount } from 'services/general/wallet';

import { notify } from 'utils/notification';

const useWalletAmount = () => {
  const { data, isLoading } = useQuery('wallet-amount', getWalletAmount, {
    onError: (error: { response: { data: { message: string } } }) => {
      notify({
        type: 'error',
        message: <span>{error?.response?.data?.message}</span>,
        config: {
          position: 'top-center',
          hideProgressBar: true,
          draggable: false,
        },
      });
    },
    onSuccess(data) {
      sessionStorage.setItem('walletServiceId', String(data.serviceId));
    },
    cacheTime: 0,
  });
  return { data, isLoading };
};

export { useWalletAmount };
