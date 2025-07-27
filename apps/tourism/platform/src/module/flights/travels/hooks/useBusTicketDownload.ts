import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { downloadBusTicketApi } from 'services/bus/download';
import { detectDevice } from 'utils/helpers/global';
import { notify } from 'utils/notification';
import { definitions } from 'types/bus';

const useBusTicketDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadBusTicketLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadBusTicketApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data?.url as string;
        return;
      }
      window.open(`${data?.url}`, '_blank');
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: (err as AxiosError<definitions['rpcStatus']>).response?.data?.message,
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

export default useBusTicketDownload;
