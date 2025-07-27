import { TTripTypes } from 'services/domestic/orders/interface';
import useBusTicketDownload from './useBusTicketDownload';
import useFlightTicketDownload from './useFlightTicketDownload';
import useHotelVoucherDownload from './useHotelVoucherDownload';
import useInternationalFlightTicketDownload from './useInternationalFlightTicketDownload';
import useTourTicketDownload from './useTourTicketDownload';
import useTrainTicketDownload from './useTrainTicketDownload';
import { Dispatch, SetStateAction } from 'react';

export const useHandleDownloadTicket = (setClickedItem: Dispatch<SetStateAction<string>>) => {
  const { downloadLoading, getFlightTicket } = useFlightTicketDownload();
  const { hotelDownloadLoading, getHotelVoucher } = useHotelVoucherDownload();
  const { tourDownloadLoading, getTourTicket } = useTourTicketDownload();
  const { downloadBusTicketLoading, getBusTicket } = useBusTicketDownload();
  const { downloadTrainTicketLoading, getTrainTicket } = useTrainTicketDownload();
  const { downloadInternationalFlightLoading, getInternationalFlightTicket } =
    useInternationalFlightTicketDownload();

  const isLoadingDownload =
    downloadLoading ||
    downloadBusTicketLoading ||
    downloadTrainTicketLoading ||
    downloadInternationalFlightLoading ||
    hotelDownloadLoading ||
    tourDownloadLoading;

  const handleDownload = (id: string, type: TTripTypes) => {
    switch (type) {
      case 'Flight':
        getFlightTicket(id);
        break;
      case 'Bus':
        getBusTicket(id);
        break;
      case 'Train':
        getTrainTicket(id);
        break;
      case 'International_Flight':
        getInternationalFlightTicket(id);
        break;
      case 'Hotel':
        getHotelVoucher(id);
        break;
      case 'Tour':
        getTourTicket(id);
        break;
      default:
        break;
    }
    setClickedItem(id);
  };

  return {
    isLoadingDownload,
    handleDownload,
  };
};
