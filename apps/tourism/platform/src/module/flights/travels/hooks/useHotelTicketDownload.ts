import { useMutation } from 'react-query';
import { downloadApi } from 'services/train/download';
import { detectDevice } from 'utils/helpers/global';

import { notify } from 'utils/notification';

const useHotelTicketDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadHotelTicketLoading } = useMutation({
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
        message: (err as Error).message,
      });
    },
  });

  const getHotelTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadHotelTicketLoading,
    getHotelTicket,
  };
};

export default useHotelTicketDownload;
