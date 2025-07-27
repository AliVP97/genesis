import { useMutation } from 'react-query';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';
import { downloadHotelVoucherApi } from 'services/hotel/download';

const UseHotelVoucherDownload = () => {
  const { mutate: mutateDownloadApi, isLoading: downloadHotelVoucherLoading } = useMutation({
    mutationFn: (id: string) => {
      return downloadHotelVoucherApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data?.url as string;
        return;
      }
      void window.open(`${data?.url}`, '_blank');
    },
    onError: (err) => {
      const errorMessage = (err as { response: { data: { message?: string } } })?.response?.data
        ?.message;
      notify({
        type: 'error',
        message: errorMessage,
      });
    },
  });

  const getHotelVoucher = (id: string) => {
    mutateDownloadApi(id);
  };

  return {
    downloadHotelVoucherLoading,
    getHotelVoucher,
  };
};

export default UseHotelVoucherDownload;
