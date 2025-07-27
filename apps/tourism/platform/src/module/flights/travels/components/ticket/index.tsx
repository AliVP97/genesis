import React, { useEffect, useState } from 'react';

import cn from 'classnames';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useRouter } from 'next/router';

import Divider from 'components/divider';
import Modal from 'components/modal';
import { TTrip } from 'services/domestic/orders/interface';
import { RefundDesktop } from 'module/flights/refund/desktop';
import BusRefund from 'module/bus/refund';
import HotelRefund from 'module/hotel/refund';
import UseHotelVoucherDownload from 'module/hotel/issuance/hooks/useHotelVoucherDownload';
import { HAFHASHTAD_TEL } from 'utils/static/global';
import { getTrainRefundPath } from 'module/train/refund';
import InternationalFlightRefund from 'module/internationalFlight/refund/components/Refund';
import useInternationalFlightRefundModalState from 'module/internationalFlight/refund/hooks/useInternationalFlightRefundModalState';
import TravelTicketDetails from '../ticketDetails';
import TravelTicketHeader from '../ticketListHeader';
import TravelTicketContent from '../ticketListContent';
import TravelTicketFooter from '../ticketListFooter';
import { flightOrderMapper } from '../../helper/travelHelper';
import UseFlightOrder from '../../hooks/useFlightOrder';
import UseBusOrder from '../../hooks/useBusOrder';
import UseOrderDetails from '../../hooks/useOrderDetails';
import useFlightTicketDownload from '../../hooks/useFlightTicketDownload';
import useBusTicketDownload from '../../hooks/useBusTicketDownload';
import useTrainTicketDownload from '../../hooks/useTrainTicketDownload';
import UseCheckRefundableHotelTicket from '../../hooks/useCheckRefundableHotelTicket';
import CheckHotelRefundable from '../checkHotelRefundModal';
import useInternationalFlightTicketDownload from '../../hooks/useInternationalFlightTicketDownload';
import useInternationalFlightOrder from '../../hooks/useInternationalFlightOrder';
import useTourTicketDownload from '../../hooks/useTourTicketDownload';

import styles from '../../travels.module.scss';

interface TravelTicketProps {
  order: TTrip;
}

const TravelTicket = ({ order }: TravelTicketProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [domesticFlightRefund, setDomesticFlightRefund] = useState<boolean>(false);
  const [busRefund, setBusRefund] = useState<boolean>(false);
  const [intelRefund, setIntelRefund] = useState<boolean>(false);
  const [refundError, setRefundError] = useState<boolean>(false);
  const [showHotelRefund, setShowHotelRefund] = useState<boolean>(false);

  const { push } = useRouter();

  const { isLoading, isSuccess, flightOrder, getFlightOrder } = UseFlightOrder();
  const [selectedItem, setSelectedItem] = useState<TTrip>();
  const {
    internationalFlightModalState,
    isInternationalFlightModalVisible,
    setInternationalFlightModalLoading,
  } = useInternationalFlightRefundModalState();

  const { isLoading: intelIsLoading, getInternationalFlightOrder } = useInternationalFlightOrder();
  const { isLoading: detailsIsLoading, getOrderDetails, order: orderDetails } = UseOrderDetails();

  const { busOrder, getBusOrder } = UseBusOrder();

  const { downloadLoading, getFlightTicket } = useFlightTicketDownload();
  const { downloadBusTicketLoading, getBusTicket } = useBusTicketDownload();
  const { downloadTrainTicketLoading, getTrainTicket } = useTrainTicketDownload();

  const { downloadInternationalFlightLoading, getInternationalFlightTicket } =
    useInternationalFlightTicketDownload();

  const { downloadHotelVoucherLoading, getHotelVoucher } = UseHotelVoucherDownload();

  const { tourDownloadLoading, getTourTicket } = useTourTicketDownload();

  const {
    checkRefund,
    hotelRefund,
    isLoading: checkHotelRefundableLoading,
    isFetching,
  } = UseCheckRefundableHotelTicket(order?.orderId || '');

  const downloadTicket = () => {
    switch (order.type) {
      case 'Flight':
        getFlightTicket(order?.orderId || '');
        break;
      case 'Bus':
        getBusTicket(order?.orderId || '');
        break;
      case 'Train':
        getTrainTicket(order?.orderId || '');
        break;

      case 'International_Flight':
        getInternationalFlightTicket(order?.orderId || '');
        break;

      case 'Hotel':
        getHotelVoucher(order?.orderId || '');
        break;
      case 'Tour':
        getTourTicket(order?.orderId || '');

        break;
      default:
        break;
    }
  };

  const refundTicket = () => {
    switch (order.type) {
      case 'Train':
        if (!order) return;
        push(getTrainRefundPath(order.orderId));
        break;
      case 'Flight':
        if (!order) return;
        setDomesticFlightRefund(true);
        getFlightOrder(order.orderId);
        break;
      case 'Bus':
        if (!order) return;
        setBusRefund(true);
        getBusOrder(order.orderId);
        break;
      case 'International_Flight':
        setSelectedItem(order);
        getInternationalFlightOrder(order.orderId);
        setIntelRefund(true);
        break;
      case 'Hotel':
        if (!order) return;
        setSelectedItem(order);
        checkRefund();
        break;
      case 'Tour':
        push(`tel:${HAFHASHTAD_TEL}`);
        break;
      default:
        break;
    }
  };

  const generateHeaderTitle = (): string => {
    switch (order.type) {
      case 'Train':
        return ` قطار`;
      case 'Flight':
        return ` پرواز داخلی`;
      case 'Bus':
        return ` اتوبوس`;
      case 'International_Flight':
        return ` پرواز خارجی `;
      case 'Hotel':
        return `هتل`;
      case 'Tour':
        return 'تور';
      default:
        return '-';
    }
  };
  useEffect(() => {
    if (hotelRefund) {
      if (hotelRefund?.refundStatus !== 'REFUND_CHECK_STATUS_UNDEFINED') {
        setRefundError(true);
      } else {
        setShowHotelRefund(true);
      }
    }
  }, [hotelRefund, isFetching]);

  useEffect(() => {
    if (intelRefund && order.type === 'International_Flight' && order.orderId) {
      setInternationalFlightModalLoading();
    }
  }, [intelRefund, order, setInternationalFlightModalLoading]);

  useEffect(() => {
    if (internationalFlightModalState === 'close') {
      setIntelRefund(false);
    }
  }, [internationalFlightModalState]);

  const serviceIsLoading =
    (order.type === 'Flight' && isLoading) ||
    (order.type === 'Hotel' && checkHotelRefundableLoading) ||
    (order.type === 'International_Flight' &&
      (intelIsLoading || internationalFlightModalState === 'loading'));

  const downloadIsLoading =
    downloadLoading ||
    downloadBusTicketLoading ||
    downloadTrainTicketLoading ||
    downloadInternationalFlightLoading ||
    downloadHotelVoucherLoading ||
    tourDownloadLoading;

  return (
    <>
      <div className={cn(styles.travels__ticket, 'd-flex flex-column bg-color-white p-3 mb-3')}>
        <TravelTicketHeader
          open={open}
          loading={detailsIsLoading}
          setOpen={setOpen}
          title={generateHeaderTitle()}
          orderId={order.orderId!}
          type={order?.type}
          getOrderDetails={getOrderDetails}
        />
        <Divider type={'horizontal'} style={'dashed'} className="bg-light my-2" />
        <TravelTicketContent order={order} />
        <TravelTicketFooter
          orderType={order?.type}
          isLoading={serviceIsLoading}
          downloadLoading={downloadIsLoading}
          downloadTicket={downloadTicket}
          refundTicket={refundTicket}
        />
      </div>

      {/* -----------Handle modal for details and refund----------------- */}
      {domesticFlightRefund && order.type === 'Flight' && (
        <Modal
          visible={domesticFlightRefund && isSuccess}
          onClose={() => setDomesticFlightRefund(false)}
          backdropDisable={false}
          className="stop-scrolling"
        >
          {flightOrder && (
            <RefundDesktop
              onClose={() => setDomesticFlightRefund(false)}
              order={flightOrderMapper(flightOrder)}
            />
          )}
        </Modal>
      )}
      {busRefund && order.type === 'Bus' && (
        <Modal
          visible={busRefund}
          onClose={() => setBusRefund(false)}
          backdropDisable={false}
          className="stop-scrolling"
        >
          {busOrder && order?.orderId && (
            <BusRefund
              orderId={order?.orderId}
              onClose={() => setBusRefund(false)}
              order={busOrder}
            />
          )}
        </Modal>
      )}

      {isInternationalFlightModalVisible && order.orderId === selectedItem?.orderId && (
        <InternationalFlightRefund orderId={order?.orderId ?? ''} />
      )}

      {refundError && order.orderId === selectedItem?.orderId && (
        <CheckHotelRefundable
          hotelRefund={hotelRefund}
          refundError={refundError}
          setRefundError={setRefundError}
        />
      )}

      {showHotelRefund && order.orderId === selectedItem?.orderId && (
        <Modal
          visible={showHotelRefund}
          onClose={() => setShowHotelRefund(false)}
          backdropDisable={false}
          className={styles.showHotelRefund}
        >
          <HotelRefund
            order={order}
            onClose={() => {
              setShowHotelRefund(false);
              push('/profile/travels');
            }}
          />
        </Modal>
      )}

      <BottomSheet open={open} onDismiss={() => setOpen(false)}>
        {orderDetails && (
          <>
            <TravelTicketDetails details={orderDetails} isLoading={detailsIsLoading} />
          </>
        )}
      </BottomSheet>
    </>
  );
};
export default TravelTicket;
