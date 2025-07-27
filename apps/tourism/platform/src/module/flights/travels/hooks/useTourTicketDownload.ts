import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';
import { downloadTourVoucherApi } from 'services/tour/download';

const useTourTicketDownload = () => {
  const SuccessDownloadTourVoucher = (data: string) => {
    if (detectDevice() === 'mobile') {
      window.location.href = data;
      return;
    }
    window.open(`${data}`, '_blank');
  };

  const ErrorDownloadTourVoucher = (err: string) => {
    notify({
      type: 'error',
      message: err,
    });
  };

  const { mutate: mutateDownloadApi, isLoading: tourDownloadLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadTourVoucherApi(id);
    },
    onSuccess: (data) => SuccessDownloadTourVoucher(data?.url),
    onError: (err) => ErrorDownloadTourVoucher((err as Error).message),
  });

  const getTourTicket = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    tourDownloadLoading,
    getTourTicket,
  };
};

export default useTourTicketDownload;
