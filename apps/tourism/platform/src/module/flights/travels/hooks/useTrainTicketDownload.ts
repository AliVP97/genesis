import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { downloadApi } from 'services/train/download';
import { detectDevice } from 'utils/helpers/global';
import { notify } from 'utils/notification';
import { definitions } from 'types/rajatrain';

const useTrainTicketDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadTrainTicketLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data.url as string;
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

  const getTrainTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadTrainTicketLoading,
    getTrainTicket,
  };
};

export default useTrainTicketDownload;
