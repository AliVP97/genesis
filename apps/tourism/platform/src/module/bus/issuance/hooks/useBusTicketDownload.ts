import { useMutation } from 'react-query';
import { downloadBusTicketApi } from 'services/bus/download';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';

const UseBusTicketDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadBusTicketLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadBusTicketApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data?.url as string;
        return;
      }
      void window.open(`${data?.url}`, '_blank');
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: (err as Error).message,
      });
    },
  });

  const getBusTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadBusTicketLoading,
    getBusTicket,
  };
};

export default UseBusTicketDownload;
