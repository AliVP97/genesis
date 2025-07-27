import { useMutation } from 'react-query';
import { internationalFlightDownloadApi } from 'services/domestic/download';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';

const useInternationalFlightTicketDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadInternationalFlightLoading } = useMutation({
    mutationFn: (id: string) => {
      return internationalFlightDownloadApi(id);
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

  const getInternationalFlightTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadInternationalFlightLoading,
    getInternationalFlightTicket,
  };
};

export default useInternationalFlightTicketDownload;
