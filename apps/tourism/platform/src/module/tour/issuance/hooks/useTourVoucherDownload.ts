import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';
import { downloadTourVoucherApi } from 'services/tour/download';

const UseTourVoucherDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadTourVoucherLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadTourVoucherApi(id);
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

  const getTourVoucher = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadTourVoucherLoading,
    getTourVoucher,
  };
};

export default UseTourVoucherDownload;
