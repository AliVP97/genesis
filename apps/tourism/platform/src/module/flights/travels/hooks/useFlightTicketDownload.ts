import { useMutation } from 'react-query';
import { downloadApi } from 'services/domestic/download';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';

const useFlightTicketDownload = () => {
  const {
    mutate: mutateDownloadApi,

    isLoading: downloadLoading,
  } = useMutation({
    mutationFn: (id: string) => {
      return downloadApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data?.url as string;
        return;
      }
      window.open(data?.url, '_blank');
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: (err as Error).message,
      });
    },
  });

  const getFlightTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadLoading,
    getFlightTicket,
  };
};

export default useFlightTicketDownload;
