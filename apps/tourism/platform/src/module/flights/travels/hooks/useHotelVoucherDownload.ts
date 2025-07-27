import { useMutation } from 'react-query';
import { downloadHotelVoucherApi } from 'services/hotel/download';
import { notify } from 'utils/notification';
import { detectDevice } from 'utils/helpers/global';

const useHotelVoucherDownload = () => {
  const {
    mutate: mutateDownloadApi,

    isLoading: hotelDownloadLoading,
  } = useMutation({
    mutationFn: (id: string) => {
      return downloadHotelVoucherApi(id);
    },
    onSuccess: (data) => {
      if (detectDevice() === 'mobile') {
        window.location.href = data?.url as string;
        return;
      }
      window.open(data?.url, '_blank');
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
    hotelDownloadLoading,
    getHotelVoucher,
  };
};

export default useHotelVoucherDownload;
