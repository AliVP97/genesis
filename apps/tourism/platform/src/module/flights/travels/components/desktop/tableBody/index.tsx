import { useEffect, useState } from 'react';

import cn from 'classnames';
import { useRouter } from 'next/router';

import { ArrowDownIcon } from 'assets/icons';
import Modal from 'components/modal';
import Spinner from 'components/spinner';
import { TTrip, TTrips } from 'services/domestic/orders/interface';
import UseFlightOrder from 'module/flights/travels/hooks/useFlightOrder';
import { flightOrderMapper } from 'module/flights/travels/helper/travelHelper';
import { RefundDesktop } from 'module/flights/refund/desktop';
import UseBusOrder from 'module/flights/travels/hooks/useBusOrder';
import BusRefund from 'module/bus/refund';
import UseOrderDetails from 'module/flights/travels/hooks/useOrderDetails';
import UseCheckRefundableHotelTicket from 'module/flights/travels/hooks/useCheckRefundableHotelTicket';
import HotelRefund from 'module/hotel/refund';
import { TRIP_TYPES_TITLES } from './constants/orderTitles';
import { useHandleDownloadTicket } from 'module/flights/travels/hooks/useHandleDownloadTicket';
import { HAFHASHTAD_TEL } from 'utils/static/global';
import { InternationalFlightRefund } from 'module/internationalFlight/refund';
import useInternationalFlightRefundModalState from 'module/internationalFlight/refund/hooks/useInternationalFlightRefundModalState';
import { getTrainRefundPath } from 'module/train/refund';
import TripDetails from '../orderDetails';
import TravelPassengers from '../passengers';
import CheckHotelRefundable from '../../checkHotelRefundModal';

import styles from '../../../travels.module.scss';

type TripsTableBodyProps = {
  orders?: TTrips;
};
export type Visible = {
  [key: number]: boolean;
};

const passengerLabel = (val: string | undefined) =>
  val === 'Hotel' ? 'مسافران و اتاق ها' : 'مسافران';
const downloadLabel = (val: string | undefined) =>
  val === 'Hotel' ? 'دانلود واچر' : 'دانلود بلیط';
const refundLabel = (val: string | undefined) => (val === 'Tour' ? 'تماس با پشتیبانی' : 'استرداد');

const TripsTableBody = ({ orders }: TripsTableBodyProps) => {
  const [clickedItem, setClickedItem] = useState('');
  const [showHotelRefund, setShowHotelRefund] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<Visible>({});
  const [refundModal, setRefundModal] = useState<Visible>({});
  const [busRetrievalVisible, setBusRetrievalVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<TTrip>();
  const [refundError, setRefundError] = useState<boolean>(false);
  const [passengersVisible, setPassengersVisible] = useState<boolean>(false);
  const len = orders?.length as number;

  const { push } = useRouter();

  const { isLoadingDownload, handleDownload } = useHandleDownloadTicket(setClickedItem);

  const { flightOrder, isLoading, isSuccess, getFlightOrder } = UseFlightOrder();

  const { isSuccess: busIsSuccess, isLoading: busIsLoading, busOrder, getBusOrder } = UseBusOrder();

  const {
    isLoading: detailsIsLoading,
    isSuccess: detailsIsSuccess,
    getOrderDetails,
    order: orderDetails,
  } = UseOrderDetails();

  const {
    checkRefund,
    hotelRefund,
    isFetching,
    isSuccess: checkHotelRefundSuccess,
  } = UseCheckRefundableHotelTicket(selectedTicket?.orderId || '');

  const refund = (item: TTrip, index?: number) => {
    switch (item.type) {
      case 'Flight':
        getFlightOrder(item.orderId);
        setRefundModal((prev) => ({
          ...prev,
          [index as number]: true,
        }));
        break;
      case 'Train':
        push(getTrainRefundPath(item.orderId));
        break;
      case 'Bus':
        setSelectedTicket(item);
        getBusOrder(item.orderId);
        setBusRetrievalVisible(true);
        break;
      case 'Hotel':
        checkRefund();
        setRefundError(true);
        break;
      default:
        break;
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
    if (selectedTicket?.type === 'Hotel') {
      refund(selectedTicket);
    }
  }, [selectedTicket]);

  const handleRefundClick = (trip: TTrip | undefined, index: number) => () => {
    const tripType = trip?.type;

    if (!tripType) {
      return;
    }

    if (tripType !== 'Hotel' && tripType !== 'International_Flight') {
      refund(trip, index);
    }

    if (tripType === 'International_Flight') {
      setRefundError(true);
    }
    if (tripType === 'Tour') {
      push(`tel:${HAFHASHTAD_TEL}`);
    }

    setSelectedTicket({ ...trip });
  };

  const {
    internationalFlightModalState,
    isInternationalFlightModalVisible,
    setInternationalFlightModalLoading,
  } = useInternationalFlightRefundModalState();

  useEffect(() => {
    if (selectedTicket?.type === 'International_Flight' && refundError && selectedTicket?.orderId) {
      setInternationalFlightModalLoading();
    }
  }, [
    refundError,
    selectedTicket?.orderId,
    selectedTicket?.type,
    setInternationalFlightModalLoading,
  ]);

  useEffect(() => {
    if (internationalFlightModalState === 'close') {
      setSelectedTicket(undefined);
      setRefundError(false);
    }
  }, [internationalFlightModalState]);

  const handleCloseModal = (index: number) => {
    setDetailVisible((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  return (
    <tbody>
      {orders?.map((item, index) => {
        const price = Number(item?.price)?.toLocaleString();
        return (
          <tr
            key={item?.orderNumber + index.toString() + 'travels'}
            className={cn('text-3 p-5 color-on-surface', index === len - 1 ? '' : 'border-bottom')}
          >
            <td className="text-center p-4">{item.orderNumber}</td>
            <td className="text-center">{TRIP_TYPES_TITLES[item.type || 'Undefined']}</td>
            <td className="text-center">{`${item?.orderTimeString}`}</td>
            <td className="text-center">
              {item.type === 'Hotel'
                ? `هتل ${item?.title} `
                : item.type === 'Tour'
                  ? item.source
                  : `${item.source} به ${item.destination}`}
            </td>
            <td className="text-center">{`${price} ریال`}</td>
            <td
              className={cn(styles['travels-container__pointer'], 'text-center color-primary')}
              onClick={() => {
                getOrderDetails(item.orderId, item.type);
                setPassengersVisible(true);
                setSelectedTicket(item);
              }}
            >
              {detailsIsLoading && item.orderId == selectedTicket?.orderId && passengersVisible ? (
                <div className="p-4">
                  <Spinner />
                </div>
              ) : (
                <span>{passengerLabel(item.type)}</span>
              )}
            </td>
            <td
              className={cn(styles['travels-container__pointer'], 'text-center color-primary')}
              onClick={() => handleDownload(String(item.orderId), item.type || 'Undefined')}
            >
              {isLoadingDownload && item.orderId == clickedItem ? (
                <div className="p-4">
                  <Spinner />
                </div>
              ) : (
                <span>{downloadLabel(item.type)}</span>
              )}
            </td>
            <td
              className={cn(styles['travels-container__pointer'], 'text-center color-primary')}
              onClick={handleRefundClick(item, index)}
            >
              {(isLoading || busIsLoading || internationalFlightModalState === 'loading') &&
              selectedTicket?.orderId === item.orderId ? (
                <div className="p-2">
                  <Spinner />
                </div>
              ) : (
                <span>{refundLabel(item.type)}</span>
              )}
            </td>
            <td
              className={cn(styles['travels-container__pointer'], 'text-center color-primary')}
              onClick={() => {
                setDetailVisible((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              }}
            >
              {detailsIsLoading && selectedTicket?.orderId == item.orderId && !passengersVisible ? (
                <Spinner />
              ) : (
                <ArrowDownIcon
                  onClick={() => {
                    getOrderDetails(item.orderId, item.type);
                    setSelectedTicket(item);
                  }}
                  className={styles['travels-container__arrow-icon']}
                />
              )}
            </td>

            {orderDetails && (
              <Modal
                visible={detailVisible[index]}
                onClose={() => handleCloseModal(index)}
                backdropDisable={false}
              >
                <TripDetails onClose={() => handleCloseModal(index)} details={orderDetails} />
              </Modal>
            )}

            {flightOrder && isSuccess && selectedTicket?.orderId === item?.orderId && (
              <Modal
                visible={refundModal[index]}
                onClose={() =>
                  setRefundModal((prev) => ({
                    ...prev,
                    [index]: false,
                  }))
                }
                backdropDisable={false}
              >
                <RefundDesktop
                  onClose={() => {
                    setRefundModal((prev) => ({
                      ...prev,
                      [index]: false,
                    }));
                    push('/profile/travels');
                  }}
                  order={flightOrderMapper(flightOrder)}
                />
              </Modal>
            )}
          </tr>
        );
      })}

      {selectedTicket && orderDetails && detailsIsSuccess && (
        <>
          <Modal
            visible={passengersVisible}
            onClose={() => setPassengersVisible(false)}
            backdropDisable={false}
          >
            <TravelPassengers
              selectedTicket={orderDetails}
              setPassengersVisible={setPassengersVisible}
            />
          </Modal>
        </>
      )}

      {isInternationalFlightModalVisible && (
        <InternationalFlightRefund orderId={selectedTicket?.orderId ?? ''} />
      )}

      {busOrder && busIsSuccess && (
        <Modal
          visible={busRetrievalVisible}
          onClose={() => setBusRetrievalVisible(false)}
          backdropDisable={false}
        >
          {selectedTicket?.orderId && (
            <BusRefund
              order={busOrder}
              onClose={() => setBusRetrievalVisible(false)}
              orderId={selectedTicket?.orderId}
            />
          )}
        </Modal>
      )}

      {refundError && checkHotelRefundSuccess && hotelRefund?.message && (
        <CheckHotelRefundable
          hotelRefund={hotelRefund}
          refundError={refundError}
          setRefundError={setRefundError}
        />
      )}

      {showHotelRefund && (
        <Modal
          visible={showHotelRefund}
          onClose={() => setShowHotelRefund(false)}
          backdropDisable={false}
          className="stop-scrolling"
        >
          <HotelRefund order={selectedTicket} onClose={() => setShowHotelRefund(false)} />
        </Modal>
      )}
    </tbody>
  );
};

export default TripsTableBody;
